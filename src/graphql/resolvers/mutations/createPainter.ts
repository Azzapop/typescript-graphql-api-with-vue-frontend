import { MutationResolvers } from "@services/graphql/types";
import { painters as dbPpainters } from '../../database'

export const createPainter: MutationResolvers['createPainter'] = (
  _parent,
  { input: painter },
  _context,
) => {
  dbPpainters.push(painter);
  return painter;
};
