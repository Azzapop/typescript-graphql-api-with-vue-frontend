import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type {
  GqlQueryResolvers,
  GqlResolversTypes,
} from '@services/graphql/types';
import { PaintingSchema } from '../../../prisma/generated/zod';

const PrismaToGql = PaintingSchema.transform(
  ({
    id,
    title,
    techniqueId,
    painterId,
    date,
  }): GqlResolversTypes['Painting'] => ({
    id,
    title,
    techniqueId,
    painterId,
    date: date.toString(),
  })
);

export const paintings: GqlQueryResolvers['paintings'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPaintings = await prisma.painting.findMany();
  const parsedPaintings = dbPaintings.map((dbPainting) =>
    PrismaToGql.safeParse(dbPainting)
  );
  const parsedPaintingResults = parsedPaintings.map((result) => {
    if (result.success) {
      return result.data;
    } else {
      logger.info('Failed to parse painting.');
      logger.error({ error: result.error });
      return null;
    }
  });
  return parsedPaintingResults.filter((result) => result !== null);
};
