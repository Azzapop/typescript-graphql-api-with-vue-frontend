import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import type { GqlGetPaintersQuery } from './use-painters.gql';

const GET_PAINTERS_QUERY = gql`
  query GetPainters {
    painters {
      name
      country
    }
  }
`;

export const usePainters = async () => {
  return useQuery<GqlGetPaintersQuery>(GET_PAINTERS_QUERY);
};
