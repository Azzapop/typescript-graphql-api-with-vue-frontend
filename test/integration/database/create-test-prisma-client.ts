import { PrismaClient } from '@prisma/client';
import { TEST_SCHEMA } from './database-const';

export const createTestPrismaClient = async (): Promise<{
  prisma: PrismaClient;
  schema: string;
}> => {
  // Create schema if it doesn't exist using base URL without schema parameter
  const baseUrl = process.env.DATABASE_URL?.split('?')[0];
  const tempPrisma = new PrismaClient({
    datasources: {
      db: {
        url: baseUrl,
      },
    },
  });
  await tempPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${TEST_SCHEMA}"`);
  await tempPrisma.$disconnect();

  // Create client using DATABASE_URL which already has schema parameter set by vitest config
  const prisma = new PrismaClient();

  return { prisma, schema: TEST_SCHEMA };
};
