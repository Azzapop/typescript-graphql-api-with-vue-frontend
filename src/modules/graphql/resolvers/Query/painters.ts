import type { GqlQueryResolvers } from '@libs/graphql-types';
import { prisma } from '@modules/prisma';

export const painters: GqlQueryResolvers['painters'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPainters = await prisma.painter.findMany();
  return dbPainters;
};
