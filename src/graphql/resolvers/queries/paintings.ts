import { QueryResolvers } from '@services/graphql/types';
import { paintings as dbPaintings } from '../../database';

export const paintings: QueryResolvers['paintings'] = (
  _parent,
  _args,
  _context
) => {
  return dbPaintings;
};
