import { transformPainter } from '@libs/graphql-transformers';
import type { GqlQueryResolvers } from '@libs/graphql-types';
import { client as prisma } from '@modules/prisma/client';

export const painter: GqlQueryResolvers['painter'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainter = await prisma.painter.findUnique({ where: { id } });
  return transformPainter(dbPainter);
};
