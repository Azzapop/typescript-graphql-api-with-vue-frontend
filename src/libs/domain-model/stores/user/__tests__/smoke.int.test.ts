import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import {
  cleanWorkerDatabase,
  createTestPrismaClient,
} from '#test/integration/database';

/**
 * Smoke test to verify integration test infrastructure works
 * Tests basic database setup, cleanup, and schema isolation
 */
describe('Integration Test Infrastructure (smoke test)', () => {
  let prisma: PrismaClient;
  let schema: string;

  beforeAll(async () => {
    // Get Prisma client for this worker's schema
    const result = await createTestPrismaClient();
    prisma = result.prisma;
    schema = result.schema;
  });

  beforeEach(async () => {
    // Clean all data in worker schema before each test
    await cleanWorkerDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should have a unique schema per worker', () => {
    const workerId = process.env.VITEST_POOL_ID || '1';
    expect(schema).toBe(`test_worker_${workerId}`);
  });

  it('should connect to database successfully', async () => {
    // Test basic database connectivity
    const result = await prisma.$queryRaw<
      Array<{ count: bigint }>
    >`SELECT COUNT(*) as count FROM "User"`;
    expect(result[0].count).toBe(0n);
  });

  it('should clean database between tests', async () => {
    // Create a user
    await prisma.user.create({
      data: {
        id: 'test-user-id',
        tokenVersion: 'test-token-version',
      },
    });

    // Verify user exists
    const userCount = await prisma.user.count();
    expect(userCount).toBe(1);

    // Clean database
    await cleanWorkerDatabase(prisma);

    // Verify user is deleted
    const cleanCount = await prisma.user.count();
    expect(cleanCount).toBe(0);
  });

  it('should handle foreign key constraints during cleanup', async () => {
    // Create user with credentials
    const user = await prisma.user.create({
      data: {
        id: 'test-user-id',
        tokenVersion: 'test-token-version',
        localCredentials: {
          create: {
            username: 'testuser',
            hashedPassword: 'test-hash',
          },
        },
      },
    });

    // Create user profile
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        email: 'test@example.com',
      },
    });

    // Create refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
      },
    });

    // Verify all created
    expect(await prisma.user.count()).toBe(1);
    expect(await prisma.userProfile.count()).toBe(1);
    expect(await prisma.localCredentials.count()).toBe(1);
    expect(await prisma.refreshToken.count()).toBe(1);

    // Clean database (should handle FK constraints correctly)
    await cleanWorkerDatabase(prisma);

    // Verify all deleted
    expect(await prisma.user.count()).toBe(0);
    expect(await prisma.userProfile.count()).toBe(0);
    expect(await prisma.localCredentials.count()).toBe(0);
    expect(await prisma.refreshToken.count()).toBe(0);
  });
});
