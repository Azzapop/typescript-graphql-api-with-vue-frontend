import { prisma } from '~libs/domain-model/prisma';
import { GqlBadParseError, GqlNotFoundError } from '~libs/graphql-errors';
import { transformPainter } from '~libs/graphql-transformers';
import type { GqlPaintingResolvers } from '~libs/graphql-types';

// TODO hide authorId in the schema?
export const painter: GqlPaintingResolvers['painter'] = async (
  { painterId },
  _args,
  _context
) => {
  const dbPainter = await prisma.painter.findFirst({
    where: { id: painterId },
  });
  if (dbPainter === null) {
    throw new GqlNotFoundError();
  }
  const result = transformPainter(dbPainter);

  if (!result) {
    throw new GqlBadParseError();
  }

  return result;
};
