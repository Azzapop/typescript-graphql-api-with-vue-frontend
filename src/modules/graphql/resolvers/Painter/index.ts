import type { GqlPainterResolvers } from '~libs/graphql-types';
import { techniques } from './techniques';

export const Painter: GqlPainterResolvers = {
  id: (parent) => parent.id,
  country: (parent) => parent.country,
  name: (parent) => parent.name,
  techniques,
};
