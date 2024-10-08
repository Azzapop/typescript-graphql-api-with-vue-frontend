import {
  transformPaintingInput,
  transformPainting,
} from '@libs/graphql-transformers';
import type { GqlMutationResolvers } from '@libs/graphql-types';
import { logger } from '@libs/logger';
import { prisma } from '@modules/prisma';

export const createPainting: GqlMutationResolvers['createPainting'] = async (
  _parent,
  { input },
  _context
) => {
  const data = transformPaintingInput(input);
  if (data === null) {
    logger.error('Invalid painting data.');
    throw new Error('INVALID_PAINTING_DATA');
  }

  const dbPainting = await prisma.painting.create({ data });
  const result = transformPainting(dbPainting);
  if (result === null) {
    logger.error('Invalid painting created.');
    throw new Error('INVALID_PAINTING_CREATE');
  }

  return result;
};
