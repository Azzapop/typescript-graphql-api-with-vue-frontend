import { QueryResolvers } from '@services/graphql/types';
import { painter } from './painter';
import { painters } from './painters';
import { painting } from './painting';
import { paintings } from './paintings';

export const Query: QueryResolvers = {
  painter,
  painters,
  painting,
  paintings,
};
