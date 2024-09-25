import { QueryResolvers } from '@services/graphql/types';
import { paintings as dbPaintings } from '../../database';

export const painting: QueryResolvers['painting'] = (
  _parent,
  { title },
  _context
) => {
  const dbPainting = dbPaintings.find(
    (_dbPainting) => _dbPainting.title === title
  );
  return dbPainting || null;
};
