import type { Technique } from '@prisma/client';
import type { GqlResolversTypes } from '~libs/graphql-types';
import { GqlTechniqueSchema } from '~libs/graphql-validators';
import { logger } from '~libs/logger';
import { TechniqueSchema } from '~libs/prisma-validators';

const PrismaToGql = TechniqueSchema.transform(
  ({ id, name }): GqlResolversTypes['Technique'] => ({
    id,
    name,
  })
).pipe(GqlTechniqueSchema());

export const transformTechnique = (
  technique: Technique | null
): GqlResolversTypes['Technique'] | null => {
  const result = PrismaToGql.safeParse(technique);
  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform technique.');
    logger.error(result.error.message);
    return null;
  }
};
