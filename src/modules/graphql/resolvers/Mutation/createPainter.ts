import { GqlBadInputError, GqlBadParseError } from '@libs/graphql-errors';
import {
  transformPainterInput,
  transformPainter,
} from '@libs/graphql-transformers';
import type { GqlMutationResolvers } from '@libs/graphql-types';
import { logger } from '@libs/logger';
import { prisma } from '@modules/prisma';

export const createPainter: GqlMutationResolvers['createPainter'] = async (
  _parent,
  { input },
  _context
) => {
  const data = transformPainterInput(input);
  if (data === null) {
    logger.error('Invalid painter data.');
    throw new GqlBadInputError();
  }

  const dbPainter = await prisma.painter.create({ data });

  const result = transformPainter(dbPainter);
  if (result === null) {
    logger.error('Invalid painter created.');
    throw new GqlBadParseError();
  }

  return result;
};
