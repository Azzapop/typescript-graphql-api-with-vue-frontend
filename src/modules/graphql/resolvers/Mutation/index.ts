import type { GqlMutationResolvers } from '~libs/graphql-types';
import { createPainter } from './createPainter';
import { createPainting } from './createPainting';

export const Mutation: GqlMutationResolvers = {
  createPainter,
  createPainting,
};
