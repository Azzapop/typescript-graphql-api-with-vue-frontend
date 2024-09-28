import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type {
  GqlMutationResolvers,
  GqlResolversTypes,
} from '@services/graphql/types';
import { PaintingSchema } from '../../../prisma/generated/zod';

const PrismaToGql = PaintingSchema.transform(
  ({
    id,
    title,
    painterId,
    techniqueId,
    date,
  }): GqlResolversTypes['Painting'] => ({
    id,
    title,
    painterId,
    techniqueId,
    date: date.toString(),
  })
);

export const createPainting: GqlMutationResolvers['createPainting'] = async (
  _parent,
  { input: painting },
  _context
) => {
  const dbPainting = await prisma.painting.create({ data: { ...painting } });
  const result = PrismaToGql.safeParse(dbPainting);
  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to create painting.');
    throw new Error('ERROR_CREATE_PAINTING');
  }
};
