import { GqlBadParseError } from '~libs/graphql-errors';
import { transformTechnique } from '~libs/graphql-transformers';
import type { GqlPaintingResolvers } from '~libs/graphql-types';
import { logger } from '~libs/logger';
import { prisma } from '~modules/prisma';

// TODO hide techniqueId in the schema?
export const technique: GqlPaintingResolvers['technique'] = async (
  { techniqueId },
  _args,
  _context
) => {
  const dbTechnique = await prisma.technique.findFirst({
    where: { id: techniqueId },
  });

  const result = transformTechnique(dbTechnique);
  if (result === null) {
    logger.error('Failed to find technique for painting.');
    throw new GqlBadParseError();
  }

  return result;
};
