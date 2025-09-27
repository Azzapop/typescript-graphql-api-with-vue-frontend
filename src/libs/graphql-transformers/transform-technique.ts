import type { Technique } from '@prisma/client';
import type { GqlResolversTypes } from '~libs/graphql-types';
import { GqlTechniqueSchema } from '~libs/graphql-validators';
import { logger } from '~libs/logger';
import { TechniqueSchema } from '~libs/prisma-validators';

const PRISMA_TO_GQL = TechniqueSchema.transform(
  ({ id, name }): GqlResolversTypes['Technique'] => ({
    id,
    name,
  })
).pipe(GqlTechniqueSchema());

export const transformTechnique = (
  technique: Technique | null
): GqlResolversTypes['Technique'] | null => {
  const result = PRISMA_TO_GQL.safeParse(technique);
  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform technique.');
    logger.error(result.error.message);
    return null;
  }
};
