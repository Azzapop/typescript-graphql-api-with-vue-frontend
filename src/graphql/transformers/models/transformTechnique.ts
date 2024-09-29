import { logger } from '@libs/logger';
import type { GqlResolversTypes } from '@services/graphql/types';
import type { Technique } from '../../../prisma/generated/zod';
import { TechniqueSchema } from '../../../prisma/generated/zod';

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
