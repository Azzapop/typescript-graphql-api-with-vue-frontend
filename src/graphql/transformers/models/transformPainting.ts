import { logger } from '@libs/logger';
import type { GqlResolversTypes } from '@services/graphql/types';
import type { Painting } from '../../../prisma/generated/zod';
import { PaintingSchema } from '../../../prisma/generated/zod';

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
