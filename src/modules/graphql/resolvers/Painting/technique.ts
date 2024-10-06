import { transformTechnique } from '@libs/graphql-transformers';
import type { GqlPaintingResolvers } from '@libs/graphql-types';
import { logger } from '@libs/logger';
import { client as prisma } from '@modules/prisma/client';

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
    throw new Error('MISSING_technique_ERROR');
  }

  return result;
};
