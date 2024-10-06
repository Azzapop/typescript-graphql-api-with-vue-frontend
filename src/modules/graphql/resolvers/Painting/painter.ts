import { transformPainter } from '@libs/graphql-transformers';
import type { GqlPaintingResolvers } from '@libs/graphql-types';
import { client as prisma } from '@modules/prisma/client';

// TODO hide authorId in the schema?
export const painter: GqlPaintingResolvers['painter'] = async (
  { painterId },
  _args,
  _context
) => {
  const dbPainter = await prisma.painter.findFirst({
    where: { id: painterId },
  });
  const result = transformPainter(dbPainter);

  if (!result) {
    // TODO use proper gql error
    throw new Error('MISSING_PAINTER');
  }

  return result;
};
