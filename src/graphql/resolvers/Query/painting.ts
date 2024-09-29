import { prisma } from '@services/domain-model/prisma';
import type { GqlQueryResolvers } from '@services/graphql/types';
import { transformPainting } from '../../transformers/models/transformPainting';

export const painting: GqlQueryResolvers['painting'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainting = await prisma.painting.findFirst({ where: { id } });
  return transformPainting(dbPainting);
};
