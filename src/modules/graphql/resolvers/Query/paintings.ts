import { transformPainting } from '@libs/graphql-transformers';
import type { GqlQueryResolvers } from '@libs/graphql-types';
import { client as prisma } from '@modules/prisma/client';

export const paintings: GqlQueryResolvers['paintings'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPaintings = await prisma.painting.findMany();
  const parsedPaintings = dbPaintings.map(transformPainting);
  return parsedPaintings.filter((result) => result !== null);
};
