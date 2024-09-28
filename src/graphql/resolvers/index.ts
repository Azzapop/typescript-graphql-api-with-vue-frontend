import type { GqlResolvers } from '@services/graphql/types';
import { Mutation } from './Mutation';
import { Painter } from './Painter';
import { Painting } from './Painting';
import { Query } from './Query';
import { Technique } from './Technique';

export const resolvers: GqlResolvers = {
  Query,
  Mutation,
  Painter,
  Painting,
  Technique,
};
