import type { Prisma } from '@prisma/client';
import type { GqlPaintingInput } from '~libs/graphql-types';
import { GqlPaintingInputSchema } from '~libs/graphql-validators';
import { logger } from '~libs/logger';
import { PaintingCreateInputSchema } from '~libs/prisma-validators/zod';

const GQL_TO_PRISMA = GqlPaintingInputSchema()
  .transform(
    ({ title, painterId, techniqueId, date }): Prisma.PaintingCreateInput => ({
      title,
      painter: { connect: { id: painterId } },
      technique: { connect: { id: techniqueId } },
      date,
    })
  )
  .pipe(PaintingCreateInputSchema);

export const transformPaintingInput = (
  input: GqlPaintingInput
): Prisma.PaintingCreateInput | null => {
  const result = GQL_TO_PRISMA.safeParse(input);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform painting input params.');
    logger.error(result.error.message);
    return null;
  }
};
