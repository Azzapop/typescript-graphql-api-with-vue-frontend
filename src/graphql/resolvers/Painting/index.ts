import type { GqlPaintingResolvers } from '@services/graphql/types';
import { painter } from './painter';
import { technique } from './technique';

export const Painting: GqlPaintingResolvers = {
  id: (parent) => parent.id,
  title: (parent) => parent.title,
  painterId: (parent) => parent.painterId,
  painter,
  techniqueId: (parent) => parent.techniqueId,
  technique,
  date: (parent) => parent.date,
};
