import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type {
  GqlPaintingResolvers,
  GqlResolversTypes,
} from '@services/graphql/types';
import { TechniqueSchema } from '../../../prisma/generated/zod';

const PrismaToGql = TechniqueSchema.transform(
  ({ id, name }): GqlResolversTypes['Technique'] => ({
    id,
    name,
  })
);

// TODO hide authorId in the schema?
export const technique: GqlPaintingResolvers['technique'] = async (
  { techniqueId },
  _args,
  _context
) => {
  const dbTechnique = await prisma.technique.findFirst({
    where: { id: techniqueId },
  });
  const result = PrismaToGql.safeParse(dbTechnique);
  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to find technique for painting.');
    throw new Error('MISSING_technique_ERROR');
  }
};
