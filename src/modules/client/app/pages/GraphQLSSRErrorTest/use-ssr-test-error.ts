import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import type { GqlSsrTestErrorQuery } from './use-ssr-test-error.gql';

const SSR_TEST_ERROR_QUERY = gql`
  query SsrTestError {
    testError
  }
`;

export const useSsrTestError = () =>
  useQuery<GqlSsrTestErrorQuery>(SSR_TEST_ERROR_QUERY);
