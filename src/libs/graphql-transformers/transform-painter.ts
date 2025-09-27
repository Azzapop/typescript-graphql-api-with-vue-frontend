import type { Painter } from '@prisma/client';
import type { GqlPainter, GqlResolversTypes } from '~libs/graphql-types';
import { GqlPainterSchema } from '~libs/graphql-validators';
import { logger } from '~libs/logger';
import { PainterSchema } from '~libs/prisma-validators';

const PRISMA_TO_GQL = PainterSchema.transform(
  ({ id, name, country }): GqlPainter => ({
    id,
    name,
    country,
    techniques: [], // TODO Make optional. Techniques will get loaded in a sub-resolver see GqlResolversTypes['Painter']
  })
).pipe(GqlPainterSchema());

export const transformPainter = (
  painter: Painter
): GqlResolversTypes['Painter'] | null => {
  const result = PRISMA_TO_GQL.safeParse(painter);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform prisma painter.');
    logger.error(result.error.message);
    return null;
  }
};
