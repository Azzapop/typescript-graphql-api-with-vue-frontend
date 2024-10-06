import { logger } from '@libs/logger';
import type { GqlPaintingInput } from '@libs/graphql-types';
import { GqlPaintingInputSchema } from '@libs/graphql-validators';
import type { Prisma } from '@prisma/client';

const GqlToPrisma = GqlPaintingInputSchema().transform(
  ({ title, painterId, techniqueId, date }): Prisma.PaintingCreateInput => {
    return {
      title,
      painter: { connect: { id: painterId } },
      technique: { connect: { id: techniqueId } },
      date,
    };
  }
);

export const transformPaintingInput = (
  input: GqlPaintingInput
): Prisma.PaintingCreateInput | null => {
  const result = GqlToPrisma.safeParse(input);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to parse correct input params.');
    return null;
  }
};