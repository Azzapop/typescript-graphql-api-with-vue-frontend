import type { GqlQueryResolvers } from '@services/graphql/types';
import { painter } from './painter';
import { painters } from './painters';
import { painting } from './painting';
import { paintings } from './paintings';

export const Query: GqlQueryResolvers = {
  painter,
  painters,
  painting,
  paintings,
};
