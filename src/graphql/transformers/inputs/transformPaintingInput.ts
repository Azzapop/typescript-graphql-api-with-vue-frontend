import { logger } from '@libs/logger';
import { Prisma } from '@prisma/client';
import { GqlPaintingInput } from '@services/graphql/types';
import { PaintingInputSchema } from '@services/graphql/validations';

const GqlToPrisma = PaintingInputSchema().transform(
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
