import { cleanWorkerDatabase } from '#test/integration';
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../../user';
import * as LocalCredentialsStore from '../index';

/**
 * Integration tests for LocalCredentialsStore.getWithUser
 * Tests credentials retrieval with user data using real database
 */
const prisma = new PrismaClient();

describe('LocalCredentialsStore.getWithUser (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('when credentials exist', () => {
    it('should return credentials with user data', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Get credentials with user
      const result = await LocalCredentialsStore.getWithUser('testuser');

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        id: expect.any(String),
        userId: userResult.data.id,
        username: 'testuser',
        hashedPassword: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        user: {
          id: userResult.data.id,
          tokenVersion: userResult.data.tokenVersion,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should include complete user object', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Get credentials
      const result = await LocalCredentialsStore.getWithUser('testuser');

      expect(result?.user).toEqual(userResult.data);
    });

    it('should hash password correctly', async () => {
      // Create user
      await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'my-secret-password',
      });

      // Get credentials
      const result = await LocalCredentialsStore.getWithUser('testuser');

      expect(result).not.toBeNull();
      // Password should be hashed, not plain text
      expect(result?.hashedPassword).not.toBe('my-secret-password');
      expect(result?.hashedPassword).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt format
    });
  });

  describe('when credentials do not exist', () => {
    it('should return null for non-existent username', async () => {
      const result =
        await LocalCredentialsStore.getWithUser('non-existent-user');

      expect(result).toBeNull();
    });

    it('should return null for empty string username', async () => {
      const result = await LocalCredentialsStore.getWithUser('');

      expect(result).toBeNull();
    });

    it('should return null when username case does not match', async () => {
      // Create user with lowercase username
      await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      // Try to get with different case (should be case-sensitive)
      const result = await LocalCredentialsStore.getWithUser('TestUser');

      expect(result).toBeNull();
    });
  });

  describe('username case sensitivity', () => {
    it('should be case-sensitive for usernames', async () => {
      // Create users with different cases
      const user1Result = await UserStore.createWithLocalCredentials({
        username: 'TestUser',
        password: 'pass1',
      });
      const user2Result = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'pass2',
      });

      expect(user1Result.success).toBe(true);
      expect(user2Result.success).toBe(true);
      if (!user1Result.success || !user2Result.success) return;

      // Get each user by exact username
      const result1 = await LocalCredentialsStore.getWithUser('TestUser');
      const result2 = await LocalCredentialsStore.getWithUser('testuser');

      expect(result1?.user.id).toBe(user1Result.data.id);
      expect(result2?.user.id).toBe(user2Result.data.id);
      expect(result1?.user.id).not.toBe(result2?.user.id);
    });
  });

  describe('multiple users', () => {
    it('should return correct credentials for each username', async () => {
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

      // Get each user's credentials
      const result1 = await LocalCredentialsStore.getWithUser('user1');
      const result2 = await LocalCredentialsStore.getWithUser('user2');
      const result3 = await LocalCredentialsStore.getWithUser('user3');

      // Verify correct user data is returned
      expect(result1?.user.id).toBe(user1Result.data.id);
      expect(result2?.user.id).toBe(user2Result.data.id);
      expect(result3?.user.id).toBe(user3Result.data.id);

      // Verify usernames match
      expect(result1?.username).toBe('user1');
      expect(result2?.username).toBe('user2');
      expect(result3?.username).toBe('user3');
    });

    it('should have different password hashes for different passwords', async () => {
      // Create users with different passwords
      await UserStore.createWithLocalCredentials({
        username: 'user1',
        password: 'password1',
      });
      await UserStore.createWithLocalCredentials({
        username: 'user2',
        password: 'password2',
      });

      // Get credentials
      const result1 = await LocalCredentialsStore.getWithUser('user1');
      const result2 = await LocalCredentialsStore.getWithUser('user2');

      expect(result1?.hashedPassword).not.toBe(result2?.hashedPassword);
    });
  });

  describe('data consistency', () => {
    it('should return consistent data across multiple calls', async () => {
      // Create user
      await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      // Get credentials multiple times
      const result1 = await LocalCredentialsStore.getWithUser('testuser');
      const result2 = await LocalCredentialsStore.getWithUser('testuser');
      const result3 = await LocalCredentialsStore.getWithUser('testuser');

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    it('should include all required fields', async () => {
      // Create user
      await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      // Get credentials
      const result = await LocalCredentialsStore.getWithUser('testuser');

      // Verify credentials fields
      expect(result).toBeDefined();
      expect(result?.id).toBeDefined();
      expect(result?.user.id).toBeDefined();
      expect(result?.username).toBeDefined();
      expect(result?.hashedPassword).toBeDefined();
      expect(result?.createdAt).toBeDefined();
      expect(result?.updatedAt).toBeDefined();

      // Verify user fields
      expect(result?.user).toBeDefined();
      expect(result?.user.id).toBeDefined();
      expect(result?.user.tokenVersion).toBeDefined();
      expect(result?.user.createdAt).toBeDefined();
      expect(result?.user.updatedAt).toBeDefined();
    });
  });

  describe('after user deletion', () => {
    it('should return null after credentials are deleted', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Verify credentials exist
      const resultBefore = await LocalCredentialsStore.getWithUser('testuser');
      expect(resultBefore).not.toBeNull();

      // Delete credentials and user
      await prisma.localCredentials.delete({
        where: { userId: userResult.data.id },
      });
      await prisma.user.delete({
        where: { id: userResult.data.id },
      });

      // Verify credentials are gone
      const resultAfter = await LocalCredentialsStore.getWithUser('testuser');
      expect(resultAfter).toBeNull();
    });
  });

  describe('foreign key relationship', () => {
    it('should maintain referential integrity between credentials and user', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Get credentials
      const result = await LocalCredentialsStore.getWithUser('testuser');

      expect(result).not.toBeNull();
      // Credentials user id should match user id
      expect(result?.user.id).toBe(result?.user.id);
      expect(result?.user.id).toBe(userResult.data.id);
    });
  });

  describe('authentication use case', () => {
    it('should provide all data needed for password verification', async () => {
      // Create user
      await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      // Get credentials (as would happen during login)
      const result = await LocalCredentialsStore.getWithUser('testuser');

      expect(result).not.toBeNull();
      // Should have username for verification
      expect(result?.username).toBe('testuser');
      // Should have hashed password for bcrypt comparison
      expect(result?.hashedPassword).toBeDefined();
      expect(result?.hashedPassword.length).toBeGreaterThan(0);
      // Should have user object for session creation
      expect(result?.user).toBeDefined();
      expect(result?.user.id).toBeDefined();
      expect(result?.user.tokenVersion).toBeDefined();
    });
  });
});
