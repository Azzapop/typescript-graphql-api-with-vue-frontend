import { MutationResolvers } from '@services/graphql/types';
import { createPainter } from './createPainter';
import { createPainting } from './createPainting';

export const Mutation: MutationResolvers = {
  createPainter,
  createPainting,
};
