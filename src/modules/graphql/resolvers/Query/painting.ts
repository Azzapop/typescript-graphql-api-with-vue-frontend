import { transformPainting } from '@libs/graphql-transformers';
import type { GqlQueryResolvers } from '@libs/graphql-types';
import { client as prisma } from '@modules/prisma/client';

export const painting: GqlQueryResolvers['painting'] = async (
  _parent,
  { id },
  _context
) => {
  const dbPainting = await prisma.painting.findFirst({ where: { id } });
  return transformPainting(dbPainting);
};
