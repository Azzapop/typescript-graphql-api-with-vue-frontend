import { cleanWorkerDatabase } from '#test/integration';
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../../user';
import * as RefreshTokenStore from '../index';

/**
 * Integration tests for RefreshTokenStore.clearTokenFamily
 * Tests deletion of all refresh tokens for a user using real database
 */
const prisma = new PrismaClient();

describe('RefreshTokenStore.clearTokenFamily (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('successful token deletion', () => {
    it('should delete all tokens for user', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create multiple tokens
      const token1 = await RefreshTokenStore.createToken(userResult.data);
      const token2 = await RefreshTokenStore.createToken(userResult.data);
      const token3 = await RefreshTokenStore.createToken(userResult.data);

      // Verify tokens exist
      const tokensBefore = await prisma.refreshToken.findMany({
        where: { userId: userResult.data.id },
      });
      expect(tokensBefore).toHaveLength(3);

      // Clear all tokens
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);

      // Verify tokens are deleted
      const tokensAfter = await prisma.refreshToken.findMany({
        where: { userId: userResult.data.id },
      });
      expect(tokensAfter).toHaveLength(0);

      // Verify specific tokens are deleted
      const token1After = await prisma.refreshToken.findUnique({
        where: { id: token1.id },
      });
      const token2After = await prisma.refreshToken.findUnique({
        where: { id: token2.id },
      });
      const token3After = await prisma.refreshToken.findUnique({
        where: { id: token3.id },
      });

      expect(token1After).toBeNull();
      expect(token2After).toBeNull();
      expect(token3After).toBeNull();
    });

    it('should work with single token', async () => {
      // Create user and single token
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      const token = await RefreshTokenStore.createToken(userResult.data);

      // Clear tokens
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);

      // Verify token is deleted
      const tokenAfter = await prisma.refreshToken.findUnique({
        where: { id: token.id },
      });
      expect(tokenAfter).toBeNull();
    });

    it('should succeed even when no tokens exist', async () => {
      // Create user without tokens
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Clear tokens (should not throw error)
      await expect(
        RefreshTokenStore.clearTokenFamily(userResult.data.id)
      ).resolves.toBeUndefined();

      // Verify no tokens exist
      const tokens = await prisma.refreshToken.findMany({
        where: { userId: userResult.data.id },
      });
      expect(tokens).toHaveLength(0);
    });

    it('should succeed for non-existent user', async () => {
      // Clear tokens for non-existent user (should not throw error)
      await expect(
        RefreshTokenStore.clearTokenFamily('non-existent-user-id')
      ).resolves.toBeUndefined();
    });
  });

  describe('multiple users isolation', () => {
    it('should only delete tokens for specified user', async () => {
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

      // Create tokens for each user
      await RefreshTokenStore.createToken(user1Result.data);
      await RefreshTokenStore.createToken(user1Result.data);

      await RefreshTokenStore.createToken(user2Result.data);
      await RefreshTokenStore.createToken(user2Result.data);
      await RefreshTokenStore.createToken(user2Result.data);

      await RefreshTokenStore.createToken(user3Result.data);

      // Clear tokens for user2 only
      await RefreshTokenStore.clearTokenFamily(user2Result.data.id);

      // Verify user2's tokens are deleted
      const user2Tokens = await prisma.refreshToken.findMany({
        where: { userId: user2Result.data.id },
      });
      expect(user2Tokens).toHaveLength(0);

      // Verify user1's tokens are preserved
      const user1Tokens = await prisma.refreshToken.findMany({
        where: { userId: user1Result.data.id },
      });
      expect(user1Tokens).toHaveLength(2);

      // Verify user3's tokens are preserved
      const user3Tokens = await prisma.refreshToken.findMany({
        where: { userId: user3Result.data.id },
      });
      expect(user3Tokens).toHaveLength(1);
    });

    it('should not affect other users when clearing empty family', async () => {
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
      await RefreshTokenStore.createToken(user1Result.data);
      await RefreshTokenStore.createToken(user1Result.data);

      // Clear tokens for user2 (who has no tokens)
      await RefreshTokenStore.clearTokenFamily(user2Result.data.id);

      // Verify user1's tokens are preserved
      const user1Tokens = await prisma.refreshToken.findMany({
        where: { userId: user1Result.data.id },
      });
      expect(user1Tokens).toHaveLength(2);
    });
  });

  describe('idempotency', () => {
    it('should be idempotent (can call multiple times)', async () => {
      // Create user and tokens
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await RefreshTokenStore.createToken(userResult.data);
      await RefreshTokenStore.createToken(userResult.data);

      // Clear tokens multiple times
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);

      // Verify tokens are deleted
      const tokens = await prisma.refreshToken.findMany({
        where: { userId: userResult.data.id },
      });
      expect(tokens).toHaveLength(0);
    });
  });

  describe('integration with findYoungest', () => {
    it('should return null from findYoungest after clearing family', async () => {
      // Create user and tokens
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await RefreshTokenStore.createToken(userResult.data);
      await RefreshTokenStore.createToken(userResult.data);

      // Verify findYoungest returns token
      const youngestBefore = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );
      expect(youngestBefore).not.toBeNull();

      // Clear family
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);

      // Verify findYoungest returns null
      const youngestAfter = await RefreshTokenStore.findYoungest(
        userResult.data.id
      );
      expect(youngestAfter).toBeNull();
    });
  });

  describe('user preservation', () => {
    it('should not delete user when clearing tokens', async () => {
      // Create user and tokens
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await RefreshTokenStore.createToken(userResult.data);
      await RefreshTokenStore.createToken(userResult.data);

      // Clear tokens
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);

      // Verify user still exists
      const user = await UserStore.getById(userResult.data.id);
      expect(user).not.toBeNull();
      expect(user?.id).toBe(userResult.data.id);
    });

    it('should not affect user credentials when clearing tokens', async () => {
      // Create user and tokens
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await RefreshTokenStore.createToken(userResult.data);
      await RefreshTokenStore.createToken(userResult.data);

      // Get credentials before clearing
      const credentialsBefore = await prisma.localCredentials.findUnique({
        where: { userId: userResult.data.id },
      });

      // Clear tokens
      await RefreshTokenStore.clearTokenFamily(userResult.data.id);

      // Verify credentials are unchanged
      const credentialsAfter = await prisma.localCredentials.findUnique({
        where: { userId: userResult.data.id },
      });

      expect(credentialsAfter).toEqual(credentialsBefore);
    });
  });
});
