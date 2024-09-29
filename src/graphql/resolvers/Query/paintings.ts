import { prisma } from '@services/domain-model/prisma';
import type { GqlQueryResolvers } from '@services/graphql/types';
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
