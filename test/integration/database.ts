import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

/**
 * Get unique schema name for this Vitest worker
 * Each worker gets its own isolated PostgreSQL schema
 */
const getWorkerSchema = (): string => {
  const workerId = process.env.VITEST_POOL_ID || '1';
  return `test_worker_${workerId}`;
};

/**
 * Create Prisma client configured for this worker's schema
 * Returns both the client and the schema name for reference
 */
export const createTestPrismaClient = async (): Promise<{
  prisma: PrismaClient;
  schema: string;
}> => {
  const schema = getWorkerSchema();

  // Create schema if it doesn't exist using temporary client
  const tempPrisma = new PrismaClient();
  await tempPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await tempPrisma.$disconnect();

  // Create client with schema in connection URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}?schema=${schema}`,
      },
    },
  });

  return { prisma, schema };
};

/**
 * Run Prisma migrations on this worker's schema
 * Called once when worker starts (in global setup)
 */
export const setupWorkerDatabase = async (): Promise<void> => {
  const schema = getWorkerSchema();

  // Set schema in environment for migration
  const originalUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = `${originalUrl}?schema=${schema}`;

  // Run Prisma migrations
  execSync(
    'npx prisma migrate deploy --schema=./src/libs/domain-model/prisma/schema.prisma',
    { stdio: 'inherit' }
  );

  // Restore original URL
  process.env.DATABASE_URL = originalUrl;
};

/**
 * Clean all data in this worker's schema
 * Called in beforeEach to reset state between tests
 * Delete in order to respect foreign key constraints
 */
export const cleanWorkerDatabase = async (
  prisma: PrismaClient
): Promise<void> => {
  await prisma.refreshToken.deleteMany();
  await prisma.localCredentials.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
};

/**
 * Drop this worker's schema completely
 * Called once when worker shuts down (in global teardown)
 */
export const teardownWorkerDatabase = async (): Promise<void> => {
  const schema = getWorkerSchema();
  const prisma = new PrismaClient();
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await prisma.$disconnect();
};
