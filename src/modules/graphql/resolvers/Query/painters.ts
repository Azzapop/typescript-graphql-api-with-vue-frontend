import { prisma } from '~libs/domain-model/prisma';
import { transformPainter } from '~libs/graphql-transformers';
import type { GqlQueryResolvers } from '~libs/graphql-types';

export const painters: GqlQueryResolvers['painters'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPainters = await prisma.painter.findMany();
  const parsedPainters = dbPainters.map(transformPainter);
  return parsedPainters.filter((result) => result !== null);
};
