import { prisma } from '~libs/domain-model/prisma';
import { GqlBadParseError, GqlNotFoundError } from '~libs/graphql-errors';
import { transformPainter } from '~libs/graphql-transformers';
import type { GqlQueryResolvers } from '~libs/graphql-types';
import { logger } from '~libs/logger';

export const painter: GqlQueryResolvers['painter'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainter = await prisma.painter.findUnique({ where: { id } });
  if (!dbPainter) {
    throw new GqlNotFoundError();
  }

  const result = transformPainter(dbPainter);
  if (result === null) {
    logger.error('Invalid painter found.');
    throw new GqlBadParseError();
  }

  return result;
};
