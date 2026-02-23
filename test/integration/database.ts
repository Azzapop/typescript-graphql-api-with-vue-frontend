import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

/**
 * Get test schema name
 * All tests use a single schema since we run sequentially
 */
const getTestSchema = (): string => {
  return 'test_schema';
};

/**
 * Create Prisma client for test database
 * DATABASE_URL already has schema parameter set by setup-test-env.ts
 * Returns both the client and the schema name for reference
 */
export const createTestPrismaClient = async (): Promise<{
  prisma: PrismaClient;
  schema: string;
}> => {
  const schema = getTestSchema();

  // Create schema if it doesn't exist
  // Use a temporary client without schema to access postgres default schema
  const baseUrl = process.env.DATABASE_URL?.split('?')[0];
  const tempPrisma = new PrismaClient({
    datasources: {
      db: {
        url: baseUrl,
      },
    },
  });
  await tempPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await tempPrisma.$disconnect();

  // Create client using DATABASE_URL which already has schema parameter
  const prisma = new PrismaClient();

  return { prisma, schema };
};

/**
 * Run Prisma migrations on test schema
 * Called once in global setup before all tests
 * DATABASE_URL already has schema parameter set by setup-test-env.ts
 */
export const setupWorkerDatabase = async (): Promise<void> => {
  const schema = getTestSchema();

  // Create schema first using base URL without schema parameter
  const baseUrl = process.env.DATABASE_URL?.split('?')[0];
  const tempPrisma = new PrismaClient({
    datasources: {
      db: {
        url: baseUrl,
      },
    },
  });
  await tempPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await tempPrisma.$disconnect();

  // Run migrations using DATABASE_URL which already has schema parameter
  execSync(
    'npx prisma migrate deploy --schema=./src/libs/domain-model/prisma/schema.prisma',
    { stdio: 'inherit' }
  );
};

/**
 * Clean all data in the test schema
 * Called in beforeEach to reset state between tests
 * Uses TRUNCATE for complete cleanup with automatic cascade handling
 * This resets sequences and removes all data efficiently
 */
export const cleanWorkerDatabase = async (
  prisma: PrismaClient
): Promise<void> => {
  // Use TRUNCATE for complete cleanup with cascade
  // This resets sequences and removes all data in one operation
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "LocalCredentials" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "UserProfile" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');
};

/**
 * Drop this worker's schema completely
 * Called once when worker shuts down (in global teardown)
 */
export const teardownWorkerDatabase = async (): Promise<void> => {
  const schema = getTestSchema();
  const prisma = new PrismaClient();
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await prisma.$disconnect();
};
