import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import { GqlQueryResolvers, GqlResolversTypes } from '@services/graphql/types';
import { PainterSchema } from '../../../prisma/generated/zod';

const PrismaToGql = PainterSchema.transform(
  ({ name, country }): GqlResolversTypes['Painter'] => {
    return { name, country };
  }
);

export const painter: GqlQueryResolvers['painter'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainter = await prisma.painter.findUnique({ where: { id } });
  const result = PrismaToGql.safeParse(dbPainter);

  if (result.success) {
    return result.data;
  } else {
    logger.info('Failed to parse painter with id: ${id}');
    logger.error({ error: result.error });
    return null;
  }
};
