import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type { GqlMutationResolvers } from '@services/graphql/types';
import { transformPaintingInput } from '../../transformers/inputs/transformPaintingInput';
import { transformPainting } from '../../transformers/models/transformPainting';

export const createPainting: GqlMutationResolvers['createPainting'] = async (
  _parent,
  { input },
  _context
) => {
  const data = transformPaintingInput(input);
  if (!data) {
    logger.error('Invalid painter data.');
    throw new Error('INVALID_PAINTER');
  }

  const dbPainting = await prisma.painting.create({ data });
  return transformPainting(dbPainting);
};
