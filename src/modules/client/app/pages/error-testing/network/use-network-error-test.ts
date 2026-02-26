import { gql } from '@apollo/client/core';
import { useLazyQuery } from '@vue/apollo-composable';
import type { GqlTestNetworkErrorQuery } from './use-network-error-test.gql';

const TEST_NETWORK_ERROR_QUERY = gql`
  query TestNetworkError {
    testError
  }
`;

export const useNetworkErrorTest = () =>
  useLazyQuery<GqlTestNetworkErrorQuery>(TEST_NETWORK_ERROR_QUERY, undefined, {
    context: {
      headers: {
        'x-trigger-network-error': 'true',
      },
    },
    fetchPolicy: 'network-only',
  });
