import { transformPainting } from '@libs/graphql-transformers';
import type { GqlQueryResolvers } from '@libs/graphql-types';
import { prisma } from '@modules/prisma';

export const paintings: GqlQueryResolvers['paintings'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPaintings = await prisma.painting.findMany();
  const parsedPaintings = dbPaintings.map(transformPainting);
  return parsedPaintings.filter((result) => result !== null);
};
