import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type {
  GqlPaintingResolvers,
  GqlResolversTypes,
} from '@services/graphql/types';
import { PainterSchema } from '../../../prisma/generated/zod';

const PrismaToGql = PainterSchema.transform(
  ({ id, name, country }): GqlResolversTypes['Painter'] => ({
    id,
    name,
    country,
  })
);

// TODO hide authorId in the schema?
export const painter: GqlPaintingResolvers['painter'] = async (
  { painterId },
  _args,
  _context
) => {
  const dbPainter = await prisma.painter.findFirst({
    where: { id: painterId },
  });
  const result = PrismaToGql.safeParse(dbPainter);
  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to find painter for painting.');
    throw new Error('MISSING_PAINTER_ERROR');
  }
};
