import type { GqlQueryResolvers } from '@modules/graphql/types.generated';
import { client as prisma } from '@modules/prisma/client';

export const painters: GqlQueryResolvers['painters'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPainters = await prisma.painter.findMany();
  return dbPainters;
};
