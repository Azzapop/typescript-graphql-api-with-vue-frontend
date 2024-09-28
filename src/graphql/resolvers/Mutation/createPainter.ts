import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type {
  GqlMutationResolvers,
  GqlResolversTypes,
} from '@services/graphql/types';
import { PainterSchema } from '../../../prisma/generated/zod';

const PrismaToGql = PainterSchema.transform(
  ({ id, name, country }): GqlResolversTypes['Painter'] => {
    return { id, name, country };
  }
);

export const createPainter: GqlMutationResolvers['createPainter'] = async (
  _parent,
  { input: painter },
  _context
) => {
  const dbPainter = await prisma.painter.create({
    data: {
      ...painter,
    },
  });
  const result = PrismaToGql.safeParse(dbPainter);
  if (result.success) {
    return result.data;
  } else {
    // TODO throw an error here instead?
    logger.error('Failed to parse painter.');
    return null;
  }
};
