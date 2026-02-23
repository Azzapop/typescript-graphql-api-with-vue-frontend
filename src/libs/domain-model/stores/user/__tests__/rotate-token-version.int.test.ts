import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,

} from 'vitest';
import type { PrismaClient } from '@prisma/client';
import {
  cleanWorkerDatabase,
  createTestPrismaClient,
} from '#test/integration/database';

import * as UserStore from '../index';

/**
 * Integration tests for UserStore.rotateTokenVersion
 * Tests token version rotation using real database
 */
describe('UserStore.rotateTokenVersion (integration)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;

  });

  beforeEach(async () => {
    await cleanWorkerDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('successful token rotation', () => {
    it('should update token version', async () => {
      // Create user
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      const {
        data: { tokenVersion: originalTokenVersion, id },
      } = createResult;

      // Rotate token version
      await UserStore.rotateTokenVersion(id);

      // Get updated user
      const updatedUser = await UserStore.getById(createResult.data.id);

      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.tokenVersion).not.toBe(originalTokenVersion);
    });

    it('should generate unique token version on each rotation', async () => {
      // Create user
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      // Rotate multiple times and collect versions
      const versions: string[] = [createResult.data.tokenVersion];

      for (let i = 0; i < 5; i++) {
        await UserStore.rotateTokenVersion(createResult.data.id);
        const user = await UserStore.getById(createResult.data.id);
        if (user) {
          versions.push(user.tokenVersion);
        }
      }

      // All versions should be unique
      const uniqueVersions = new Set(versions);
      expect(uniqueVersions.size).toBe(versions.length);
    });

    it('should update updatedAt timestamp', async () => {
      // Create user
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      const {
        data: { updatedAt: originalUpdatedAt },
      } = createResult;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Rotate token version
      await UserStore.rotateTokenVersion(createResult.data.id);

      // Get updated user
      const updatedUser = await UserStore.getById(createResult.data.id);

      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    it('should not change other user fields', async () => {
      // Create user
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      const {
        data: { id: originalId, createdAt: originalCreatedAt },
      } = createResult;

      // Rotate token version
      await UserStore.rotateTokenVersion(createResult.data.id);

      // Get updated user
      const updatedUser = await UserStore.getById(createResult.data.id);

      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.id).toBe(originalId);
      expect(updatedUser?.createdAt.getTime()).toBe(
        originalCreatedAt.getTime()
      );
    });
  });

  describe('multiple users', () => {
    it('should rotate token version for specific user only', async () => {
      // Create multiple users
      const user1Result = await UserStore.createWithLocalCredentials({
        username: 'user1',
        password: 'pass1',
      });
      const user2Result = await UserStore.createWithLocalCredentials({
        username: 'user2',
        password: 'pass2',
      });
      const user3Result = await UserStore.createWithLocalCredentials({
        username: 'user3',
        password: 'pass3',
      });

      expect(user1Result.success).toBe(true);
      expect(user2Result.success).toBe(true);
      expect(user3Result.success).toBe(true);
      if (
        !user1Result.success ||
        !user2Result.success ||
        !user3Result.success
      )
        return;

      const {
        data: { tokenVersion: user1OriginalVersion },
      } = user1Result;
      const {
        data: { tokenVersion: user2OriginalVersion },
      } = user2Result;
      const {
        data: { tokenVersion: user3OriginalVersion },
      } = user3Result;

      // Rotate only user2's token version
      await UserStore.rotateTokenVersion(user2Result.data.id);

      // Get all users
      const user1After = await UserStore.getById(user1Result.data.id);
      const user2After = await UserStore.getById(user2Result.data.id);
      const user3After = await UserStore.getById(user3Result.data.id);

      // Only user2's token version should change
      expect(user1After?.tokenVersion).toBe(user1OriginalVersion);
      expect(user2After?.tokenVersion).not.toBe(user2OriginalVersion);
      expect(user3After?.tokenVersion).toBe(user3OriginalVersion);
    });
  });

  describe('error handling', () => {
    it('should throw error when user does not exist', async () => {
      await expect(
        UserStore.rotateTokenVersion('non-existent-id')
      ).rejects.toThrow();
    });

    it('should throw error for empty user id', async () => {
      await expect(UserStore.rotateTokenVersion('')).rejects.toThrow();
    });
  });

  describe('concurrent rotations', () => {
    it('should handle multiple rotations in sequence', async () => {
      // Create user
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      // Rotate token version multiple times
      await UserStore.rotateTokenVersion(createResult.data.id);
      await UserStore.rotateTokenVersion(createResult.data.id);
      await UserStore.rotateTokenVersion(createResult.data.id);

      // User should still exist with new token version
      const user = await UserStore.getById(createResult.data.id);
      expect(user).not.toBeNull();
      expect(user?.tokenVersion).not.toBe(createResult.data.tokenVersion);
    });
  });

  describe('integration with credentials', () => {
    it('should not affect user credentials when rotating token', async () => {
      // Create user
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      // Get credentials before rotation
      const credentialsBefore = await prisma.localCredentials.findUnique({
        where: { userId: createResult.data.id },
      });

      // Rotate token version
      await UserStore.rotateTokenVersion(createResult.data.id);

      // Get credentials after rotation
      const credentialsAfter = await prisma.localCredentials.findUnique({
        where: { userId: createResult.data.id },
      });

      // Credentials should be unchanged
      expect(credentialsAfter).toEqual(credentialsBefore);
    });
  });
});
