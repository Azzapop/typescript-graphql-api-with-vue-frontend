import { gql } from '@libs/@apollo/client/core';
import { GetPaintersQuery } from '@services/graphql/types';
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
