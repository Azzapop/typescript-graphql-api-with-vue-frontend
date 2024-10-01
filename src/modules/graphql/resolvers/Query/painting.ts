import type { GqlQueryResolvers } from '@modules/graphql/types.generated';
import { client as prisma } from '@modules/prisma/client';
import { transformPainting } from '../../transformers/models/transformPainting';

export const painting: GqlQueryResolvers['painting'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainting = await prisma.painting.findFirst({ where: { id } });
  return transformPainting(dbPainting);
};
