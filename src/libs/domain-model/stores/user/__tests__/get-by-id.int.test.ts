import { cleanWorkerDatabase } from '#test/integration';
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../index';

/**
 * Integration tests for UserStore.getById
 * Tests user retrieval by ID using real database
 */
const prisma = new PrismaClient();

describe('UserStore.getById (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('when user exists', () => {
    it('should return user by id', async () => {
      // Create test user
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      // Get user by id
      const user = await UserStore.getById(createResult.data.id);

      expect(user).toMatchObject({
        id: createResult.data.id,
        tokenVersion: createResult.data.tokenVersion,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return exact same data as when created', async () => {
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      const user = await UserStore.getById(createResult.data.id);

      expect(user).toEqual(createResult.data);
    });

    it('should work with multiple users', async () => {
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
      if (!user1Result.success || !user2Result.success || !user3Result.success)
        return;

      // Get each user individually
      const user1 = await UserStore.getById(user1Result.data.id);
      const user2 = await UserStore.getById(user2Result.data.id);
      const user3 = await UserStore.getById(user3Result.data.id);

      // Verify each user is returned correctly
      expect(user1?.id).toBe(user1Result.data.id);
      expect(user2?.id).toBe(user2Result.data.id);
      expect(user3?.id).toBe(user3Result.data.id);

      expect(user1?.tokenVersion).toBe(user1Result.data.tokenVersion);
      expect(user2?.tokenVersion).toBe(user2Result.data.tokenVersion);
      expect(user3?.tokenVersion).toBe(user3Result.data.tokenVersion);
    });
  });

  describe('when user does not exist', () => {
    it('should return null for non-existent id', async () => {
      const user = await UserStore.getById('non-existent-id');

      expect(user).toBeNull();
    });

    it('should return null for empty string id', async () => {
      const user = await UserStore.getById('');

      expect(user).toBeNull();
    });

    it('should return null for id that was never created', async () => {
      // Create a user to ensure database is not empty
      await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      // Try to get user with different id
      const user = await UserStore.getById('this-id-does-not-exist');

      expect(user).toBeNull();
    });
  });

  describe('after user deletion', () => {
    it('should return null after user is deleted', async () => {
      // Create user
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      // Verify user exists
      const userBefore = await UserStore.getById(createResult.data.id);
      expect(userBefore).not.toBeNull();

      // Delete user directly via Prisma
      await prisma.localCredentials.delete({
        where: { userId: createResult.data.id },
      });
      await prisma.user.delete({
        where: { id: createResult.data.id },
      });

      // Try to get deleted user
      const userAfter = await UserStore.getById(createResult.data.id);
      expect(userAfter).toBeNull();
    });
  });

  describe('data consistency', () => {
    it('should return consistent data across multiple calls', async () => {
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      // Get user multiple times
      const user1 = await UserStore.getById(createResult.data.id);
      const user2 = await UserStore.getById(createResult.data.id);
      const user3 = await UserStore.getById(createResult.data.id);

      // All calls should return identical data
      expect(user1).toEqual(user2);
      expect(user2).toEqual(user3);
    });

    it('should include all required fields', async () => {
      const createResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      const user = await UserStore.getById(createResult.data.id);

      expect(user).toBeDefined();
      expect(user?.id).toBeDefined();
      expect(user?.tokenVersion).toBeDefined();
      expect(user?.createdAt).toBeDefined();
      expect(user?.updatedAt).toBeDefined();

      expect(typeof user?.id).toBe('string');
      expect(typeof user?.tokenVersion).toBe('string');
      expect(user?.createdAt).toBeInstanceOf(Date);
      expect(user?.updatedAt).toBeInstanceOf(Date);
    });
  });
});
