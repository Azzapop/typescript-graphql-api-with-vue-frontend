import { gql } from '@apollo/client/core';
import { useLazyQuery } from '@vue/apollo-composable';
import type { GqlTestErrorQuery } from './use-test-error.gql';

const TEST_ERROR_QUERY = gql`
  query TestError {
    testError
  }
`;

export const useTestError = () =>
  useLazyQuery<GqlTestErrorQuery>(TEST_ERROR_QUERY, undefined, {
    fetchPolicy: 'network-only',
  });
