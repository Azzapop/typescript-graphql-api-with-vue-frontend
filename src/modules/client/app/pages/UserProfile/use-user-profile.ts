import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import type { GqlMeQuery } from './use-user-profile.gql';

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

export const useUserProfile = async () => {
  return useQuery<GqlMeQuery>(ME_QUERY);
};
