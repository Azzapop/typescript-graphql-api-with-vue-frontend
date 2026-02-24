import { initialize } from '#test/factories/prisma';
import { PrismaClient } from '@prisma/client';

initialize({ prisma: new PrismaClient() });
