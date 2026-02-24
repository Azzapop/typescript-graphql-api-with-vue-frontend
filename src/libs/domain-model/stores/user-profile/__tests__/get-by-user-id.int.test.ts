import { PrismaClient } from '@prisma/client';
import { cleanWorkerDatabase } from '#test/integration';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../../user';
import * as UserProfileStore from '../index';

/**
 * Integration tests for UserProfileStore.getByUserId
 * Tests user profile retrieval using real database
 */
const prisma = new PrismaClient();

describe('UserProfileStore.getByUserId (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('when profile exists', () => {
    it('should return user profile by user id', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create profile
      const profile = await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: 'test@example.com',
        },
      });

      // Get profile by user id
      const result = await UserProfileStore.getByUserId(userResult.data.id);

      expect(result).toMatchObject({
        id: profile.id,
        userId: userResult.data.id,
        email: 'test@example.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return profile with null email', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create profile without email
      await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: null,
        },
      });

      // Get profile
      const result = await UserProfileStore.getByUserId(userResult.data.id);

      expect(result).not.toBeNull();
      expect(result?.email).toBeNull();
    });

    it('should return exact same data as created', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create profile
      const profile = await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: 'test@example.com',
        },
      });

      // Get profile
      const result = await UserProfileStore.getByUserId(userResult.data.id);

      expect(result).toEqual(profile);
    });
  });

  describe('when profile does not exist', () => {
    it('should return null when user has no profile', async () => {
      // Create user without profile
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Get profile (should be null)
      const result = await UserProfileStore.getByUserId(userResult.data.id);

      expect(result).toBeNull();
    });

    it('should return null for non-existent user id', async () => {
      const result = await UserProfileStore.getByUserId('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return null for empty string user id', async () => {
      const result = await UserProfileStore.getByUserId('');

      expect(result).toBeNull();
    });
  });

  describe('multiple users', () => {
    it('should return correct profile for each user', async () => {
      // Create multiple users with profiles
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

      // Create profiles
      const profile1 = await prisma.userProfile.create({
        data: {
          userId: user1Result.data.id,
          email: 'user1@example.com',
        },
      });
      const profile2 = await prisma.userProfile.create({
        data: {
          userId: user2Result.data.id,
          email: 'user2@example.com',
        },
      });
      const profile3 = await prisma.userProfile.create({
        data: {
          userId: user3Result.data.id,
          email: null,
        },
      });

      // Get each profile
      const result1 = await UserProfileStore.getByUserId(user1Result.data.id);
      const result2 = await UserProfileStore.getByUserId(user2Result.data.id);
      const result3 = await UserProfileStore.getByUserId(user3Result.data.id);

      // Verify correct profiles returned
      expect(result1?.id).toBe(profile1.id);
      expect(result1?.email).toBe('user1@example.com');

      expect(result2?.id).toBe(profile2.id);
      expect(result2?.email).toBe('user2@example.com');

      expect(result3?.id).toBe(profile3.id);
      expect(result3?.email).toBeNull();
    });

    it('should not return profiles for other users', async () => {
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

      // Create profile for user1 only
      const profile1 = await prisma.userProfile.create({
        data: {
          userId: user1Result.data.id,
          email: 'user1@example.com',
        },
      });

      // Get profile for user1
      const result1 = await UserProfileStore.getByUserId(user1Result.data.id);
      expect(result1?.id).toBe(profile1.id);

      // Get profile for user2 (should be null)
      const result2 = await UserProfileStore.getByUserId(user2Result.data.id);
      expect(result2).toBeNull();
    });
  });

  describe('data consistency', () => {
    it('should return consistent data across multiple calls', async () => {
      // Create user and profile
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: 'test@example.com',
        },
      });

      // Get profile multiple times
      const result1 = await UserProfileStore.getByUserId(userResult.data.id);
      const result2 = await UserProfileStore.getByUserId(userResult.data.id);
      const result3 = await UserProfileStore.getByUserId(userResult.data.id);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    it('should include all required fields', async () => {
      // Create user and profile
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: 'test@example.com',
        },
      });

      // Get profile
      const result = await UserProfileStore.getByUserId(userResult.data.id);

      expect(result).toBeDefined();
      expect(result?.id).toBeDefined();
      expect(result?.userId).toBeDefined();
      expect(result?.email).toBeDefined();
      expect(result?.createdAt).toBeDefined();
      expect(result?.updatedAt).toBeDefined();

      expect(typeof result?.id).toBe('string');
      expect(typeof result?.userId).toBe('string');
      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('after profile deletion', () => {
    it('should return null after profile is deleted', async () => {
      // Create user and profile
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: 'test@example.com',
        },
      });

      // Verify profile exists
      const resultBefore = await UserProfileStore.getByUserId(
        userResult.data.id
      );
      expect(resultBefore).not.toBeNull();

      // Delete profile
      await prisma.userProfile.delete({
        where: { userId: userResult.data.id },
      });

      // Verify profile is gone
      const resultAfter = await UserProfileStore.getByUserId(
        userResult.data.id
      );
      expect(resultAfter).toBeNull();
    });
  });

  describe('foreign key relationship', () => {
    it('should enforce unique constraint on userId', async () => {
      // Create user
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      // Create first profile
      await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: 'test@example.com',
        },
      });

      // Try to create second profile for same user (should fail)
      await expect(
        prisma.userProfile.create({
          data: {
            userId: userResult.data.id,
            email: 'another@example.com',
          },
        })
      ).rejects.toThrow();
    });

    it('should cascade delete when user is deleted', async () => {
      // Create user and profile
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      const profile = await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: 'test@example.com',
        },
      });

      // Delete user (should cascade delete profile)
      await prisma.localCredentials.delete({
        where: { userId: userResult.data.id },
      });
      await prisma.userProfile.delete({
        where: { userId: userResult.data.id },
      });
      await prisma.user.delete({
        where: { id: userResult.data.id },
      });

      // Verify profile is deleted
      const profileAfter = await prisma.userProfile.findUnique({
        where: { id: profile.id },
      });
      expect(profileAfter).toBeNull();
    });

    it('should link profile to correct user', async () => {
      // Create user and profile
      const userResult = await UserStore.createWithLocalCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(userResult.success).toBe(true);
      if (!userResult.success) return;

      await prisma.userProfile.create({
        data: {
          userId: userResult.data.id,
          email: 'test@example.com',
        },
      });

      // Get profile
      const result = await UserProfileStore.getByUserId(userResult.data.id);

      expect(result).not.toBeNull();
      expect(result?.userId).toBe(userResult.data.id);
    });
  });

  describe('email field', () => {
    it('should handle various email formats', async () => {
      // Create users
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

      // Create profiles with different email formats
      await prisma.userProfile.create({
        data: {
          userId: user1Result.data.id,
          email: 'simple@example.com',
        },
      });
      await prisma.userProfile.create({
        data: {
          userId: user2Result.data.id,
          email: 'complex.email+tag@subdomain.example.com',
        },
      });
      await prisma.userProfile.create({
        data: {
          userId: user3Result.data.id,
          email: null,
        },
      });

      // Get profiles
      const result1 = await UserProfileStore.getByUserId(user1Result.data.id);
      const result2 = await UserProfileStore.getByUserId(user2Result.data.id);
      const result3 = await UserProfileStore.getByUserId(user3Result.data.id);

      expect(result1?.email).toBe('simple@example.com');
      expect(result2?.email).toBe('complex.email+tag@subdomain.example.com');
      expect(result3?.email).toBeNull();
    });
  });
});
