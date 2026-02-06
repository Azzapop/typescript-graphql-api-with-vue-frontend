import { prisma } from '~libs/domain-model/prisma';
import { GqlNotFoundError } from '~libs/graphql-errors';
import { transformPainting } from '~libs/graphql-transformers';
import type { GqlQueryResolvers } from '~libs/graphql-types';
import { logger } from '~libs/logger';

export const painting: GqlQueryResolvers['painting'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainting = await prisma.painting.findFirst({ where: { id } });
  if (dbPainting === null) {
    throw new GqlNotFoundError();
  }

  const result = transformPainting(dbPainting);
  if (result === null) {
    logger.error('Invalid painting found.');
    throw new Error('INVALID_PAINTING_FOUND');
  }

  return result;
};
