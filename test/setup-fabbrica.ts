import { initialize } from '#test/factories/prisma';
import { prisma } from '~database';

initialize({ prisma: prisma() });
