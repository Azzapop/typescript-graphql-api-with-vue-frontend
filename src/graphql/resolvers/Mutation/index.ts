import type { GqlMutationResolvers } from '@services/graphql/types';
import { createPainter } from './createPainter';
import { createPainting } from './createPainting';

export const Mutation: GqlMutationResolvers = {
  createPainter,
  createPainting,
};
