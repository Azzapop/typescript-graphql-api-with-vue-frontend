import { logger } from '@libs/logger';
import type { GqlResolversTypes } from '@libs/graphql-types';
import type { Painter } from '@libs/prisma-validators'; // TODO use prisma directly?
import { PainterSchema } from '@libs/prisma-validators';

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
