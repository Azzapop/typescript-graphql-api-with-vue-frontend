import { logger } from '@libs/logger';
import type { GqlPainterInput } from '@modules/graphql/types.generated';
import { PainterInputSchema } from '@modules/graphql/validations.generated';
import type { Prisma } from '@prisma/client';

const GqlToPrisma = PainterInputSchema().transform(
  ({
    name,
    country,
    techniques,
  }: GqlPainterInput): Prisma.PainterCreateInput => {
    return {
      name,
      country,
      painterTechniques: {
        create: techniques.map((techniqueId) => ({ techniqueId })),
      },
    };
  }
);

export const transformPainterInput = (
  input: GqlPainterInput
): Prisma.PainterCreateInput | null => {
  const result = GqlToPrisma.safeParse(input);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to parse correct input params.');
    return null;
  }
};
