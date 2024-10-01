import { logger } from '@libs/logger';
import type { GqlResolversTypes } from '@modules/graphql/types.generated';
import type { Painter } from '@modules/prisma/validators.generated';
import { PainterSchema } from '@modules/prisma/validators.generated';

const PrismaToGql = PainterSchema.transform(
  ({ id, name, country }): GqlResolversTypes['Painter'] => ({
    id,
    name,
    country,
  })
);

export const transformPainter = (
  painter: Painter | null
): GqlResolversTypes['Painter'] | null => {
  const result = PrismaToGql.safeParse(painter);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform painter.');
    return null;
  }
};
