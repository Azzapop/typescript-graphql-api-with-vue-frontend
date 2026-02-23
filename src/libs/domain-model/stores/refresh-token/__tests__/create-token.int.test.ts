import {
  cleanWorkerDatabase,
  createTestPrismaClient,
} from '#test/integration/database';
import type { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../../user';
import * as RefreshTokenStore from '../index';

/**
 * Integration tests for RefreshTokenStore.createToken
 * Tests refresh token creation using real database
 */
describe('RefreshTokenStore.createToken (integration)', () => {
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

  describe('successful token creation', () => {
    it('should create refresh token for user', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create refresh token
      const token = await RefreshTokenStore.createToken(userResult.data);

      expect(token).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      // Verify token exists in database
      const tokenInDb = await prisma.refreshToken.findUnique({
        where: { id: token.id },
      });
      expect(tokenInDb).not.toBeNull();
      expect(tokenInDb?.userId).toBe(userResult.data.id);
    });

    it('should create multiple tokens for same user', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create multiple refresh tokens
      const token1 = await RefreshTokenStore.createToken(userResult.data);
      const token2 = await RefreshTokenStore.createToken(userResult.data);
      const token3 = await RefreshTokenStore.createToken(userResult.data);

      // All tokens should have unique IDs
      expect(token1.id).not.toBe(token2.id);
      expect(token2.id).not.toBe(token3.id);
      expect(token1.id).not.toBe(token3.id);

      // All tokens should belong to same user
      const tokensInDb = await prisma.refreshToken.findMany({
        where: { userId: userResult.data.id },
      });
      expect(tokensInDb).toHaveLength(3);
    });

    it('should set timestamps correctly', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      const beforeCreation = new Date();
      const token = await RefreshTokenStore.createToken(userResult.data);
      const afterCreation = new Date();

      expect(token.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime()
      );
      expect(token.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime()
      );
      expect(token.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime()
      );
      expect(token.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime()
      );
    });
  });

  describe('multiple users', () => {
    it('should create tokens for different users independently', async () => {
      // Create multiple users
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

      // Create tokens for each user
      const token1 = await RefreshTokenStore.createToken(user1Result.data);
      const token2 = await RefreshTokenStore.createToken(user2Result.data);

      // Verify tokens belong to correct users
      const token1InDb = await prisma.refreshToken.findUnique({
        where: { id: token1.id },
      });
      const token2InDb = await prisma.refreshToken.findUnique({
        where: { id: token2.id },
      });

      expect(token1InDb?.userId).toBe(user1Result.data.id);
      expect(token2InDb?.userId).toBe(user2Result.data.id);
    });

    it('should maintain separate token counts per user', async () => {
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

      // Create different number of tokens for each user
      await RefreshTokenStore.createToken(user1Result.data);
      await RefreshTokenStore.createToken(user1Result.data);

      await RefreshTokenStore.createToken(user2Result.data);
      await RefreshTokenStore.createToken(user2Result.data);
      await RefreshTokenStore.createToken(user2Result.data);

      // Verify counts
      const user1Tokens = await prisma.refreshToken.findMany({
        where: { userId: user1Result.data.id },
      });
      const user2Tokens = await prisma.refreshToken.findMany({
        where: { userId: user2Result.data.id },
      });

      expect(user1Tokens).toHaveLength(2);
      expect(user2Tokens).toHaveLength(3);
    });
  });

  describe('foreign key relationship', () => {
    it('should enforce foreign key constraint to user', async () => {
      // Try to create token with non-existent user
      const fakeUser = {
        id: 'non-existent-user-id',
        tokenVersion: 'fake-version',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await expect(RefreshTokenStore.createToken(fakeUser)).rejects.toThrow();
    });

    it('should cascade delete when user is deleted', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create tokens
      const token1 = await RefreshTokenStore.createToken(userResult.data);
      const token2 = await RefreshTokenStore.createToken(userResult.data);

      // Verify tokens exist
      const tokensBefore = await prisma.refreshToken.findMany({
        where: { userId: userResult.data.id },
      });
      expect(tokensBefore).toHaveLength(2);

      // Delete user (should cascade delete tokens)
      await prisma.localCredentials.delete({
        where: { userId: userResult.data.id },
      });
      await prisma.user.delete({
        where: { id: userResult.data.id },
      });

      // Verify tokens are deleted
      const tokensAfter = await prisma.refreshToken.findMany({
        where: { id: { in: [token1.id, token2.id] } },
      });
      expect(tokensAfter).toHaveLength(0);
    });
  });

  describe('data consistency', () => {
    it('should return consistent data when queried', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create token
      const token = await RefreshTokenStore.createToken(userResult.data);

      // Query token from database
      const queriedToken = await prisma.refreshToken.findUnique({
        where: { id: token.id },
      });

      expect(queriedToken).toEqual(token);
    });

    it('should include all required fields', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create token
      const token = await RefreshTokenStore.createToken(userResult.data);

      expect(token.id).toBeDefined();
      expect(token.createdAt).toBeDefined();
      expect(token.updatedAt).toBeDefined();

      expect(typeof token.id).toBe('string');
      expect(token.createdAt).toBeInstanceOf(Date);
      expect(token.updatedAt).toBeInstanceOf(Date);
    });
  });
});
