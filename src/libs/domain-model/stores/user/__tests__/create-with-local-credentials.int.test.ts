import {
  cleanWorkerDatabase,
  createTestPrismaClient,
} from '#test/integration/database';
import type { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../index';

/**
 * Integration tests for UserStore.createWithLocalCredentials
 * Tests user creation with local credentials using real database
 */
describe('UserStore.createWithLocalCredentials (integration)', () => {
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

  describe('successful user creation', () => {
    it('should create user and credentials in transaction', async () => {
      const result = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          id: expect.any(String),
          tokenVersion: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });

        // Verify user exists in database
        const user = await prisma.user.findUnique({
          where: { id: result.data.id },
        });
        expect(user).not.toBeNull();

        // Verify credentials exist in database
        const credentials = await prisma.localCredentials.findUnique({
          where: { userId: result.data.id },
        });
        expect(credentials).toMatchObject({
          username: 'testuser',
          hashedPassword: expect.any(String),
        });

        // Verify password is hashed (not plain text)
        expect(credentials?.hashedPassword).not.toBe('password123');
      }
    });

    it('should generate unique token version', async () => {
      const result1 = await UserStore.createWithLocalCredentials({
        username: 'user1',
        password: 'pass1',
      });

      const result2 = await UserStore.createWithLocalCredentials({
        username: 'user2',
        password: 'pass2',
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      if (result1.success && result2.success) {
        expect(result1.data.tokenVersion).not.toBe(result2.data.tokenVersion);
      }
    });

    it('should set timestamps correctly', async () => {
      const beforeCreation = new Date();

      const result = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      const afterCreation = new Date();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdAt.getTime()).toBeGreaterThanOrEqual(
          beforeCreation.getTime()
        );
        expect(result.data.createdAt.getTime()).toBeLessThanOrEqual(
          afterCreation.getTime()
        );
        expect(result.data.updatedAt.getTime()).toBeGreaterThanOrEqual(
          beforeCreation.getTime()
        );
        expect(result.data.updatedAt.getTime()).toBeLessThanOrEqual(
          afterCreation.getTime()
        );
      }
    });
  });

  describe('unique constraint violations', () => {
    it('should return USERNAME_EXISTS when username is taken', async () => {
      // Create first user
      await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      // Try to create duplicate username
      const result = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'differentpassword',
      });

      expect(result).toEqual({
        success: false,
        error: 'USERNAME_EXISTS',
      });

      // Verify only one user exists in database
      const userCount = await prisma.user.count();
      expect(userCount).toBe(1);
    });

    it('should be case-sensitive for usernames', async () => {
      const result1 = await UserStore.createWithLocalCredentials({
        username: 'TestUser',
        password: 'pass1',
      });

      const result2 = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'pass2',
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // Both users should exist
      const userCount = await prisma.user.count();
      expect(userCount).toBe(2);
    });
  });

  describe('transaction integrity', () => {
    it('should create both user and credentials together', async () => {
      const result = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Both should exist
        const user = await prisma.user.findUnique({
          where: { id: result.data.id },
        });
        const credentials = await prisma.localCredentials.findUnique({
          where: { userId: result.data.id },
        });

        expect(user).not.toBeNull();
        expect(credentials).not.toBeNull();
        expect(credentials?.userId).toBe(user?.id);
      }
    });

    it('should not create user if credentials fail', async () => {
      // Create first user with username
      await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      const userCountBefore = await prisma.user.count();

      // Try to create another user with same username (should fail)
      const result = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'differentpassword',
      });

      expect(result.success).toBe(false);

      // User count should not increase (transaction rolled back)
      const userCountAfter = await prisma.user.count();
      expect(userCountAfter).toBe(userCountBefore);
    });
  });

  describe('password hashing', () => {
    it('should hash password before storing', async () => {
      const password = 'my-secret-password';

      const result = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const credentials = await prisma.localCredentials.findUnique({
          where: { userId: result.data.id },
        });

        // Password should be hashed
        expect(credentials?.hashedPassword).not.toBe(password);
        expect(credentials?.hashedPassword).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt format
      }
    });

    it('should create different hashes for same password', async () => {
      const password = 'same-password';

      const result1 = await UserStore.createWithLocalCredentials({
        username: 'user1',
        password,
      });

      const result2 = await UserStore.createWithLocalCredentials({
        username: 'user2',
        password,
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      if (result1.success && result2.success) {
        const creds1 = await prisma.localCredentials.findUnique({
          where: { userId: result1.data.id },
        });
        const creds2 = await prisma.localCredentials.findUnique({
          where: { userId: result2.data.id },
        });

        // Hashes should be different (salt is random)
        expect(creds1?.hashedPassword).not.toBe(creds2?.hashedPassword);
      }
    });
  });
});
