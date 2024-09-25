import { MutationResolvers } from '@services/graphql/types';
import { paintings as dbPpaintings } from '../../database';

export const createPainting: MutationResolvers['createPainting'] = (
  _parent,
  { input: painting },
  _context
) => {
  dbPpaintings.push(painting);
  return painting;
};
