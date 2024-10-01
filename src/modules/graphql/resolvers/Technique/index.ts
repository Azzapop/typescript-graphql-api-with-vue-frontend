import type { GqlTechniqueResolvers } from '@modules/graphql/types.generated';

export const Technique: GqlTechniqueResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.id,
};
