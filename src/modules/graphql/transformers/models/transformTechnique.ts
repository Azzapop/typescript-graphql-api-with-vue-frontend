import { logger } from '@libs/logger';
import type { GqlResolversTypes } from '@modules/graphql/types.generated';
import type { Technique } from '@modules/prisma/validators.generated';
import { TechniqueSchema } from '@modules/prisma/validators.generated';

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
