import type { GqlMutationResolvers } from '@modules/graphql/types.generated';
import { createPainter } from './createPainter';
import { createPainting } from './createPainting';

export const Mutation: GqlMutationResolvers = {
  createPainter,
  createPainting,
};
