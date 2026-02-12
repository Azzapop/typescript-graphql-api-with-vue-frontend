import { PrismaClient } from '@prisma/client';
import { domainModelConfig } from '../domain-model-config';

export const client = new PrismaClient({
  datasourceUrl: domainModelConfig('DATABASE_URL'),
});
