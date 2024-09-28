import { prisma } from '@services/domain-model/prisma';
import type { GqlQueryResolvers } from '@services/graphql/types';

export const painters: GqlQueryResolvers['painters'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPainters = await prisma.painter.findMany();
  return dbPainters;
};
