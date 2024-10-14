import { GqlBadParseError } from '@libs/graphql-errors';
import { transformPainter } from '@libs/graphql-transformers';
import type { GqlPaintingResolvers } from '@libs/graphql-types';
import { prisma } from '@modules/prisma';

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
    throw new GqlBadParseError();
  }

  return result;
};
