import { PrismaClient } from '@prisma/client';

export const cleanWorkerDatabase = async (): Promise<void> => {
  const prisma = new PrismaClient();
  // TRUNCATE with CASCADE resets auto-increment sequences and handles
  // foreign key ordering automatically, unlike DELETE
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "LocalCredentials" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "UserProfile" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');
  await prisma.$disconnect();
};
