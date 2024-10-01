import type { GqlPaintingResolvers } from '@modules/graphql/types.generated';
import { client as prisma } from '@modules/prisma/client';
import { transformPainter } from '../../transformers/models/transformPainter';

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
