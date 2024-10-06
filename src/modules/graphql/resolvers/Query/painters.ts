import type { GqlQueryResolvers } from '@libs/graphql-types';
import { client as prisma } from '@modules/prisma/client';

export const painters: GqlQueryResolvers['painters'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPainters = await prisma.painter.findMany();
  return dbPainters;
};
