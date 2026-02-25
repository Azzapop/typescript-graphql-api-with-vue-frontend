import { prisma } from '~database';

export const cleanWorkerDatabase = async (): Promise<void> => {
  const client = prisma();
  // TRUNCATE with CASCADE resets auto-increment sequences and handles
  // foreign key ordering automatically, unlike DELETE
  await client.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE');
  await client.$executeRawUnsafe('TRUNCATE TABLE "LocalCredentials" CASCADE');
  await client.$executeRawUnsafe('TRUNCATE TABLE "UserProfile" CASCADE');
  await client.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');
};
