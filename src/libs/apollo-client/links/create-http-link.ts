import { HttpLink, from as linkFrom } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { TRACE_TOKEN_HEADER, generateTraceToken } from '~libs/trace-token';
import type { ClientLink } from '../apollo-client-types';

export const createHttpLink = (uri: string): ClientLink => {
  const httpLink = new HttpLink({ uri });

  const traceLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      [TRACE_TOKEN_HEADER]: generateTraceToken(),
    },
  }));

  return linkFrom([traceLink, httpLink]);
};
