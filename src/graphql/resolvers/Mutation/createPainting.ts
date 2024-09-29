import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type { GqlMutationResolvers } from '@services/graphql/types';
import { transformPainting } from '../../transformers/models/transformPainting';

export const createPainting: GqlMutationResolvers['createPainting'] = async (
  _parent,
  { input: painting },
  _context
) => {
  const dbPainting = await prisma.painting.create({ data: { ...painting } });
  const result = transformPainting(dbPainting);
  if (result === null) {
    logger.error('Failed to create painting.');
    throw new Error('ERROR_CREATE_PAINTING');
  }
  return result;
};
