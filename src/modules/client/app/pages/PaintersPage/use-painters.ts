import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import type { GqlGetPaintersQuery } from './use-painters.gql';

const getPaintersQuery = gql`
  query GetPainters {
    painters {
      name
      country
    }
  }
`;

export const usePainters = async () => {
  return useQuery<GqlGetPaintersQuery>(getPaintersQuery);
};
