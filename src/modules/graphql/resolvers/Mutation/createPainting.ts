import { prisma } from '~libs/domain-model/prisma';
import { GqlBadInputError, GqlBadParseError } from '~libs/graphql-errors';
import {
  transformPaintingInput,
  transformPainting,
} from '~libs/graphql-transformers';
import type { GqlMutationResolvers } from '~libs/graphql-types';
import { logger } from '~libs/logger';

export const createPainting: GqlMutationResolvers['createPainting'] = async (
  _parent,
  { input },
  _context
) => {
  const data = transformPaintingInput(input);
  if (data === null) {
    logger.error('Invalid painting data.');
    throw new GqlBadInputError();
  }

  const dbPainting = await prisma.painting.create({ data });
  const result = transformPainting(dbPainting);
  if (result === null) {
    logger.error('Invalid painting created.');
    throw new GqlBadParseError();
  }

  return result;
};
