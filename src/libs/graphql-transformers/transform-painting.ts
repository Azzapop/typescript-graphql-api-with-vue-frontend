import type { Painting } from '@prisma/client';
import type { GqlResolversTypes } from '~libs/graphql-types';
import { GqlPaintingSchema } from '~libs/graphql-validators';
import { logger } from '~libs/logger';
import { PaintingSchema } from '~libs/prisma-validators';

const PrismaToGql = PaintingSchema.transform(
  ({
    id,
    title,
    techniqueId,
    painterId,
    date,
  }): GqlResolversTypes['Painting'] => ({
    id,
    title,
    painterId,
    techniqueId,
    date: date.toString(),
  })
).pipe(GqlPaintingSchema());

export const transformPainting = (
  painting: Painting
): GqlResolversTypes['Painting'] | null => {
  const result = PrismaToGql.safeParse(painting);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform painting.');
    logger.error(result.error.message);
    return null;
  }
};
