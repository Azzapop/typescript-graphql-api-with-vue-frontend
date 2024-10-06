import { logger } from '@libs/logger';
import type { GqlResolversTypes } from '@libs/graphql-types';
import type { Technique } from '@libs/prisma-validators';
import { TechniqueSchema } from '@libs/prisma-validators';

const PrismaToGql = TechniqueSchema.transform(
  ({ id, name }): GqlResolversTypes['Technique'] => ({
    id,
    name,
  })
);

export const transformTechnique = (
  technique: Technique | null
): GqlResolversTypes['Technique'] | null => {
  const result = PrismaToGql.safeParse(technique);
  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to parse technique.');
    return null;
  }
};
