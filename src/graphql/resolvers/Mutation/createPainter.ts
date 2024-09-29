import { prisma } from '@services/domain-model/prisma';
import type { GqlMutationResolvers } from '@services/graphql/types';
import { transformPainter } from '../../transformers/models/transformPainter';

export const createPainter: GqlMutationResolvers['createPainter'] = async (
  _parent,
  { input: painter },
  _context
) => {
  const dbPainter = await prisma.painter.create({
    data: {
      ...painter,
    },
  });
  return transformPainter(dbPainter);
};
