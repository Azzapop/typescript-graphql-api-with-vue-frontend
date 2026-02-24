import { cleanWorkerDatabase } from '#test/integration';
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

const prisma = new PrismaClient();

describe('Integration Test Infrastructure (smoke test)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to database successfully', async () => {
    const count = await prisma.user.count();
    expect(count).toBe(0);
  });

  it('should clean database between tests', async () => {
    await prisma.user.create({
      data: {
        id: 'test-user-id',
        tokenVersion: 'test-token-version',
      },
    });

    const userCount = await prisma.user.count();
    expect(userCount).toBe(1);

    await cleanWorkerDatabase();

    const cleanCount = await prisma.user.count();
    expect(cleanCount).toBe(0);
  });

  it('should handle foreign key constraints during cleanup', async () => {
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

    await prisma.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
      },
    });

    expect(await prisma.user.count()).toBe(1);
    expect(await prisma.userProfile.count()).toBe(1);
    expect(await prisma.localCredentials.count()).toBe(1);
    expect(await prisma.refreshToken.count()).toBe(1);

    await cleanWorkerDatabase();

    expect(await prisma.user.count()).toBe(0);
    expect(await prisma.userProfile.count()).toBe(0);
    expect(await prisma.localCredentials.count()).toBe(0);
    expect(await prisma.refreshToken.count()).toBe(0);
  });
});
