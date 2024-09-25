import { QueryResolvers } from '@services/graphql/types';
import { painters as dbPainters } from '../../database';

export const painters: QueryResolvers['painters'] = (
  _parent,
  _args,
  _context
) => {
  return dbPainters;
};
