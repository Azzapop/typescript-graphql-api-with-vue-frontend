import { gql } from '@apollo/client/core';
import type { GqlGetPaintersQuery } from './usePainters.generated';
import { useQuery } from '@vue/apollo-composable';

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
