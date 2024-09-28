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
    painterId,
    techniqueId,
    date: date.toString(),
  })
);

export const painting: GqlQueryResolvers['painting'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainting = await prisma.painting.findFirst({ where: { id } });
  const result = PrismaToGql.safeParse(dbPainting);
  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to find painting.');
    return null;
  }
};
