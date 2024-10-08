import type { GqlPainterInput } from '@libs/graphql-types';
import { GqlPainterInputSchema } from '@libs/graphql-validators';
import { logger } from '@libs/logger';
import { PainterCreateInputSchema } from '@libs/prisma-validators/zod';
import type { Prisma } from '@prisma/client';

const GqlToPrisma = GqlPainterInputSchema()
  .transform(
    ({ name, country, techniques }): Prisma.PainterCreateInput => ({
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
  const result = GqlToPrisma.safeParse(input);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to transform painter input params.');
    logger.error(result.error.message);
    return null;
  }
};
