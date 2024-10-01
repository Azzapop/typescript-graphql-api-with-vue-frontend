import { logger } from '@libs/logger';
import type { GqlResolversTypes } from '@modules/graphql/types.generated';
import type { Painting } from '@modules/prisma/validators.generated';
import { PaintingSchema } from '@modules/prisma/validators.generated';

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
