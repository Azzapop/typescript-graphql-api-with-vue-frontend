import { PrismaClient } from '@prisma/client';
import { databaseConfig } from './database-config';

let instance: PrismaClient | undefined;

export const client = (): PrismaClient => {
  if (!instance) {
    instance = new PrismaClient({
      datasourceUrl: databaseConfig('DATABASE_URL'),
    });
  }
  return instance;
};
