import { QueryResolvers } from '@services/graphql/types';
import { painters as dbPainters } from '../../database';

export const painter: QueryResolvers['painter'] = (
  _parent,
  { name },
  _context
) => {
  const dbPainter = dbPainters.find((_dbPainter) => _dbPainter.name === name);
  return dbPainter || null;
};
