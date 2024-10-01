import type { GqlPainterResolvers } from '@modules/graphql/types.generated';
import { techniques } from './techniques';

export const Painter: GqlPainterResolvers = {
  id: (parent) => parent.id,
  country: (parent) => parent.country,
  name: (parent) => parent.name,
  techniques,
};
