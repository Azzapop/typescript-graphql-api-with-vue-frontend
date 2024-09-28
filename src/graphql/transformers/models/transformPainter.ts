import { logger } from '@libs/logger';
import { GqlResolversTypes } from '@services/graphql/types';
import { Painter, PainterSchema } from '../../../prisma/generated/zod';

const PrismaToGql = PainterSchema.transform(
  ({ id, name, country }): GqlResolversTypes['Painter'] => ({
    id,
    name,
    country,
  })
);

export const transformPainter = (
  painter: Painter
): GqlResolversTypes['Painter'] | null => {
  const result = PrismaToGql.safeParse(painter);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform painter.');
    return null;
  }
};
