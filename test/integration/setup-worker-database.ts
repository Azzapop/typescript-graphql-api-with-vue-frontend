import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { TEST_SCHEMA } from './integration-const.js';

export const setupWorkerDatabase = async (): Promise<void> => {
  // Create schema using base URL without schema parameter
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

  // Run migrations using DATABASE_URL which already has schema parameter
  execSync(
    'npx prisma migrate deploy --schema=./src/libs/domain-model/prisma/schema.prisma',
    { stdio: 'inherit' }
  );
};
