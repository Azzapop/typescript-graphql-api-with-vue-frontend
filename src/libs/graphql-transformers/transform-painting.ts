import type { GqlResolversTypes } from '@libs/graphql-types';
import { logger } from '@libs/logger';
import type { Painting } from '@libs/prisma-validators';
import { PaintingSchema } from '@libs/prisma-validators';

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
);

export const transformPainting = (
  painting: Painting | null
): GqlResolversTypes['Painting'] | null => {
  const result = PrismaToGql.safeParse(painting);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to find painting.');
    return null;
  }
};
