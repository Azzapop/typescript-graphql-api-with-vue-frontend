import { logger } from '@libs/logger';
import { prisma } from '@services/domain-model/prisma';
import type {
  GqlPainterResolvers,
  GqlTechnique,
} from '@services/graphql/types';
import { TechniqueSchema } from '../../../prisma/generated/zod';

const PrismaToGql = TechniqueSchema.transform(
  ({ id, name }): GqlTechnique => ({ id, name })
);

export const techniques: GqlPainterResolvers['techniques'] = async (
  { id },
  _args,
  _context
) => {
  const dbPainterTechniques = await prisma.painterTechnique.findMany({
    where: { painter: { id } },
    include: { technique: true },
  });
  const parsedTechniques = dbPainterTechniques.map(
    ({ technique: dbTechnique }) => PrismaToGql.safeParse(dbTechnique)
  );
  const parsedTechniqueResults = parsedTechniques.map((result) => {
    if (result.success) {
      return result.data;
    } else {
      logger.info('Failed to parse technique.');
      logger.error({ error: result.error });
      return null;
    }
  });
  return parsedTechniqueResults.filter((result) => result !== null);
};
