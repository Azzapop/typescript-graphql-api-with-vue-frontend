import { gql } from '@apollo/client/core';
import type { GetPaintersQuery } from '@services/graphql/types';
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
  return useQuery<GetPaintersQuery>(getPaintersQuery);
};
