import type { GqlPainterInput } from '@libs/graphql-types';
import { GqlPainterInputSchema } from '@libs/graphql-validators';
import { logger } from '@libs/logger';
import type { Prisma } from '@prisma/client';

// TODO to typed object and then parse for safety?
const GqlToPrisma = GqlPainterInputSchema().transform(
  ({ name, country, techniques }): Prisma.PainterCreateInput => {
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
