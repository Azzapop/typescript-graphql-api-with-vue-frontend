import {
  transformPaintingInput,
  transformPainting,
} from '@libs/graphql-transformers';
import type { GqlMutationResolvers } from '@libs/graphql-types';
import { logger } from '@libs/logger';
import { client as prismaClient } from '@modules/prisma/client';

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
