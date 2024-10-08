import { transformPainter } from '@libs/graphql-transformers';
import type { GqlQueryResolvers } from '@libs/graphql-types';
import { logger } from '@libs/logger';
import { client as prisma } from '@modules/prisma/client';

export const painter: GqlQueryResolvers['painter'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainter = await prisma.painter.findUnique({ where: { id } });
  const result = transformPainter(dbPainter);
  if (result === null) {
    logger.error('Invalid painter created.');
    throw new Error('INVALID_PAINTER_FOUND');
  }

  return result;
};
