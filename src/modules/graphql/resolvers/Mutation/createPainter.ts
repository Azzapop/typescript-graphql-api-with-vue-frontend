import {
  transformPainterInput,
  transformPainter,
} from '@libs/graphql-transformers';
import type { GqlMutationResolvers } from '@libs/graphql-types';
import { logger } from '@libs/logger';
import { client as prisma } from '@modules/prisma/client';

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
