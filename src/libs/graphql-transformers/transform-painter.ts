import type { GqlResolversTypes } from '@libs/graphql-types';
import { GqlPainterSchema } from '@libs/graphql-validators';
import { logger } from '@libs/logger';
import { PainterSchema } from '@libs/prisma-validators';
import { Painter } from '@prisma/client';

const PrismaToGql = PainterSchema.transform(
  ({ id, name, country }): GqlResolversTypes['Painter'] => ({
    id,
    name,
    country,
  })
).pipe(GqlPainterSchema());

export const transformPainter = (
  painter: Painter | null
): GqlResolversTypes['Painter'] | null => {
  const result = PrismaToGql.safeParse(painter);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform painter.');
    logger.error(result.error.message);
    return null;
  }
};
