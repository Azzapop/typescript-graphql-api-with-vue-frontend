import { transformTechnique } from '@libs/graphql-transformers';
import type { GqlPainterResolvers } from '@libs/graphql-types';
import { client as prisma } from '@modules/prisma/client';

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
