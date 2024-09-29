import { prisma } from '@services/domain-model/prisma';
import type { GqlQueryResolvers } from '@services/graphql/types';
import { transformPainter } from '../../transformers/models/transformPainter';

export const painter: GqlQueryResolvers['painter'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainter = await prisma.painter.findUnique({ where: { id } });
  return transformPainter(dbPainter);
};
