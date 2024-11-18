import type { GqlTechniqueResolvers } from '~libs/graphql-types';

export const Technique: GqlTechniqueResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
};
