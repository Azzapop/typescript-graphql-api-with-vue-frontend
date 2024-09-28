import type { GqlTechniqueResolvers } from '@services/graphql/types';

export const Technique: GqlTechniqueResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.id,
};
