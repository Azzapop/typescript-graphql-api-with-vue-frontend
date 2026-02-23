import {
  cleanWorkerDatabase,
  createTestPrismaClient,
} from '#test/integration/database';
import type { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../../user';
import * as RefreshTokenStore from '../index';

/**
 * Integration tests for RefreshTokenStore.findYoungest
 * Tests finding most recent refresh token using real database
 */
describe('RefreshTokenStore.findYoungest (integration)', () => {
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

  describe('with single token', () => {
    it('should return the only token for user', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create token
      const token = await RefreshTokenStore.createToken(userResult.data);

      // Find youngest
      const youngest = await RefreshTokenStore.findYoungest(userResult.data.id);

      expect(youngest).toEqual(token);
    });
  });

  describe('with multiple tokens', () => {
    it('should return most recently created token', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create tokens with delays to ensure different timestamps
      const token1 = await RefreshTokenStore.createToken(userResult.data);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const token2 = await RefreshTokenStore.createToken(userResult.data);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const token3 = await RefreshTokenStore.createToken(userResult.data);

      // Find youngest (should be token3)
      const youngest = await RefreshTokenStore.findYoungest(userResult.data.id);

      expect(youngest?.id).toBe(token3.id);
      expect(youngest?.createdAt.getTime()).toBeGreaterThanOrEqual(
        token2.createdAt.getTime()
      );
      expect(youngest?.createdAt.getTime()).toBeGreaterThanOrEqual(
        token1.createdAt.getTime()
      );
    });

    it('should return newest after creating more tokens', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create initial tokens
      await RefreshTokenStore.createToken(userResult.data);
      await RefreshTokenStore.createToken(userResult.data);

      const youngest1 = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );
      expect(youngest1).not.toBeNull();

      // Create new token (should become youngest)
      await new Promise((resolve) => setTimeout(resolve, 10));
      const newToken = await RefreshTokenStore.createToken(userResult.data);

      const youngest2 = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );

      expect(youngest2?.id).toBe(newToken.id);
      expect(youngest2?.id).not.toBe(youngest1?.id);
    });
  });

  describe('when no tokens exist', () => {
    it('should return null when user has no tokens', async () => {
      // Create user without tokens
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Find youngest (should be null)
      const youngest = await RefreshTokenStore.findYoungest(userResult.data.id);

      expect(youngest).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      const youngest = await RefreshTokenStore.findYoungest(
        'non-existent-user-id'
      );

      expect(youngest).toBeNull();
    });
  });

  describe('after token deletion', () => {
    it('should return null after all tokens deleted', async () => {
      // Create user and tokens
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await RefreshTokenStore.createToken(userResult.data);
      await RefreshTokenStore.createToken(userResult.data);

      // Verify tokens exist
      const youngestBefore = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );
      expect(youngestBefore).not.toBeNull();

      // Delete all tokens
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);

      // Verify no tokens found
      const youngestAfter = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );
      expect(youngestAfter).toBeNull();
    });

    it('should return next youngest after deleting newest', async () => {
      // Create user and tokens
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      const token1 = await RefreshTokenStore.createToken(userResult.data);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const token2 = await RefreshTokenStore.createToken(userResult.data);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const token3 = await RefreshTokenStore.createToken(userResult.data);

      // Verify token3 is youngest
      const youngest1 = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );
      expect(youngest1?.id).toBe(token3.id);

      // Delete token3
      await prisma.refreshToken.delete({ where: { id: token3.id } });

      // Now token2 should be youngest
      const youngest2 = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );
      expect(youngest2?.id).toBe(token2.id);

      // Delete token2
      await prisma.refreshToken.delete({ where: { id: token2.id } });

      // Now token1 should be youngest
      const youngest3 = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );
      expect(youngest3?.id).toBe(token1.id);
    });
  });

  describe('multiple users', () => {
    it('should return correct youngest for each user independently', async () => {
      // Create users
      const user1Result = await UserStore.createWithLocalCredentials({
        username: 'user1',
        password: 'pass1',
      });
      const user2Result = await UserStore.createWithLocalCredentials({
        username: 'user2',
        password: 'pass2',
      });

      expect(user1Result.success).toBe(true);
      expect(user2Result.success).toBe(true);
      if (!user1Result.success || !user2Result.success) return;

      // Create tokens for user1
      await RefreshTokenStore.createToken(user1Result.data);
      await new Promise((resolve) => setTimeout(resolve, 10));
      const user1Token2 = await RefreshTokenStore.createToken(user1Result.data);

      // Create tokens for user2
      await RefreshTokenStore.createToken(user2Result.data);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await RefreshTokenStore.createToken(user2Result.data);
      await new Promise((resolve) => setTimeout(resolve, 10));
      const user2Token3 = await RefreshTokenStore.createToken(user2Result.data);

      // Find youngest for each user
      const user1Youngest = await RefreshTokenStore.findYoungest(
        user1Result.data.id
      );
      const user2Youngest = await RefreshTokenStore.findYoungest(
        user2Result.data.id
      );

      expect(user1Youngest?.id).toBe(user1Token2.id);
      expect(user2Youngest?.id).toBe(user2Token3.id);
    });

    it('should not return tokens from other users', async () => {
      // Create users
      const user1Result = await UserStore.createWithLocalCredentials({
        username: 'user1',
        password: 'pass1',
      });
      const user2Result = await UserStore.createWithLocalCredentials({
        username: 'user2',
        password: 'pass2',
      });

      expect(user1Result.success).toBe(true);
      expect(user2Result.success).toBe(true);
      if (!user1Result.success || !user2Result.success) return;

      // Create tokens for user1 only
      const user1Token = await RefreshTokenStore.createToken(user1Result.data);

      // Find youngest for user2 (should be null)
      const user2Youngest = await RefreshTokenStore.findYoungest(
        user2Result.data.id
      );

      expect(user2Youngest).toBeNull();

      // Verify user1's token is not returned for user2
      expect(user1Token.id).not.toBe(user2Youngest?.id);
    });
  });

  describe('data consistency', () => {
    it('should return complete token data', async () => {
      // Create user and token
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      const token = await RefreshTokenStore.createToken(userResult.data);

      // Find youngest
      const youngest = await RefreshTokenStore.findYoungest(userResult.data.id);

      expect(youngest).toEqual(token);
      expect(youngest?.id).toBeDefined();
      expect(youngest?.createdAt).toBeDefined();
      expect(youngest?.updatedAt).toBeDefined();
    });
  });
});
