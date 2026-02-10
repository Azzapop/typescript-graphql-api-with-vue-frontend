/**
 * Database utilities for integration tests.
 *
 * These helpers manage test database state to ensure tests are isolated
 * and reproducible.
 *
 * IMPORTANT: Integration tests require a running test database.
 * Set DATABASE_URL to point to your test database before running.
 */

import { PrismaClient } from '@prisma/client';

// Use a separate client instance for tests to avoid conflicts
const prisma = new PrismaClient();

/**
 * Clears all data from the database.
 * Use this in beforeEach/afterEach to ensure test isolation.
 *
 * Tables are cleared in order to respect foreign key constraints.
 */
export const resetDatabase = async (): Promise<void> => {
  // Delete in order to respect foreign key constraints
  await prisma.refreshToken.deleteMany();
  await prisma.localCredentials.deleteMany();
  await prisma.painterTechnique.deleteMany();
  await prisma.painting.deleteMany();
  await prisma.painter.deleteMany();
  await prisma.technique.deleteMany();
  await prisma.user.deleteMany();
};

/**
 * Disconnects the Prisma client.
 * Call this in afterAll to clean up connections.
 */
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

/**
 * Returns the Prisma client for direct database access in tests.
 */
export const getTestPrisma = (): PrismaClient => prisma;

/**
 * Creates a test user with minimal required fields.
 */
export const createTestUser = async (
  overrides?: Partial<{ tokenVersion: string }>
) => {
  return prisma.user.create({
    data: {
      tokenVersion: overrides?.tokenVersion ?? `v-${Date.now()}-${Math.random()}`,
    },
  });
};

/**
 * Creates a test user with local credentials (username/password).
 * Password is hashed using bcrypt.
 */
export const createTestUserWithCredentials = async (opts: {
  username: string;
  password: string;
}) => {
  const bcrypt = await import('bcrypt');
  const hashedPassword = await bcrypt.hash(opts.password, 10);

  return prisma.user.create({
    data: {
      tokenVersion: `v-${Date.now()}-${Math.random()}`,
      localCredentials: {
        create: {
          username: opts.username,
          hashedPassword,
          updatedAt: new Date(),
        },
      },
    },
    include: {
      localCredentials: true,
    },
  });
};

/**
 * Creates a test painter.
 */
export const createTestPainter = async (opts?: {
  name?: string;
  country?: string;
}) => {
  return prisma.painter.create({
    data: {
      name: opts?.name ?? `Test Painter ${Date.now()}`,
      country: opts?.country ?? 'Test Country',
    },
  });
};
