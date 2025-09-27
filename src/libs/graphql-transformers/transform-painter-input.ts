import type { Prisma } from '@prisma/client';
import type { GqlPainterInput } from '~libs/graphql-types';
import { GqlPainterInputSchema } from '~libs/graphql-validators';
import { logger } from '~libs/logger';
import { PainterCreateInputSchema } from '~libs/prisma-validators';

const GQL_TO_PRISMA = GqlPainterInputSchema()
  .transform(
    ({
      name,
      country,
      techniques,
    }: GqlPainterInput): Prisma.PainterCreateInput => ({
      name,
      country,
      painterTechniques: {
        create: techniques.map((techniqueId) => ({ techniqueId })),
      },
    })
  )
  .pipe(PainterCreateInputSchema);

export const transformPainterInput = (
  input: GqlPainterInput
): Prisma.PainterCreateInput | null => {
  const result = GQL_TO_PRISMA.safeParse(input);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform graphql painter input params.');
    logger.error(result.error.message);
    return null;
  }
};
