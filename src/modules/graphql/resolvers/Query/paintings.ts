import type { GqlQueryResolvers } from '@modules/graphql/types.generated';
import { client as prisma } from '@modules/prisma/client';
import { transformPainting } from '../../transformers/models/transformPainting';

export const paintings: GqlQueryResolvers['paintings'] = async (
  _parent,
  _args,
  _context
) => {
  const dbPaintings = await prisma.painting.findMany();
  const parsedPaintings = dbPaintings.map(transformPainting);
  return parsedPaintings.filter((result) => result !== null);
};
