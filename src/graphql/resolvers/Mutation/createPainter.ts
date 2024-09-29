import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type { GqlMutationResolvers } from '@services/graphql/types';
import { transformPainterInput } from '../../transformers/inputs/transformPainterInput';
import { transformPainter } from '../../transformers/models/transformPainter';

export const createPainter: GqlMutationResolvers['createPainter'] = async (
  _parent,
  { input },
  _context
) => {
  const data = transformPainterInput(input);
  if (!data) {
    logger.error('Invalid painter data.');
    throw new Error('INVALID_PAINTER');
  }

  const dbPainter = await prisma.painter.create({
    data,
  });
  return transformPainter(dbPainter);
};
