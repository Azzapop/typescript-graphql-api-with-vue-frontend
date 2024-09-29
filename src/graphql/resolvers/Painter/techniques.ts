import { prisma } from '@services/domain-model/prisma';
import type { GqlPainterResolvers } from '@services/graphql/types';
import { transformTechnique } from '../../transformers/models/transformTechnique';

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
    ({ technique: dbTechnique }) => transformTechnique(dbTechnique)
  );
  return parsedTechniques.filter((result) => result !== null);
};
