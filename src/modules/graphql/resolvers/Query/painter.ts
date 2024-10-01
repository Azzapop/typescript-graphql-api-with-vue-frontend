import type { GqlQueryResolvers } from '@modules/graphql/types.generated';
import { client as prisma } from '@modules/prisma/client';
import { transformPainter } from '../../transformers/models/transformPainter';

export const painter: GqlQueryResolvers['painter'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainter = await prisma.painter.findUnique({ where: { id } });
  return transformPainter(dbPainter);
};
