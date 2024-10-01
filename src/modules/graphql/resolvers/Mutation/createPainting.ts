import { logger } from '@libs/logger';
import type { GqlMutationResolvers } from '@modules/graphql/types.generated';
import { client as prismaClient } from '@modules/prisma/client';
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

  const dbPainting = await prismaClient.painting.create({ data });
  return transformPainting(dbPainting);
};
