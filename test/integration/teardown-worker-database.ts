import { PrismaClient } from '@prisma/client';
import { TEST_SCHEMA } from './integration-const.js';

export const teardownWorkerDatabase = async (): Promise<void> => {
  const prisma = new PrismaClient();
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${TEST_SCHEMA}" CASCADE`);
  await prisma.$disconnect();
};
