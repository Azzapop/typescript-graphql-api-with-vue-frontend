import { onError } from '@apollo/client/link/error';
import { TRACE_TOKEN_HEADER } from '~libs/trace-token';
import type { ClientLink, GraphQLErrorInfo } from '../apollo-client-types';

const getTraceToken = (
  headers: Record<string, unknown>
): string | undefined => {
  const { [TRACE_TOKEN_HEADER]: traceToken } = headers;
  return typeof traceToken === 'string' ? traceToken : undefined;
};

export const createGraphQLErrorLink = (
  handler: (errors: GraphQLErrorInfo[], traceToken: string | undefined) => void
): ClientLink =>
  // TODO: upgrade to Apollo Client v4 and use the `error` property instead of `graphQLErrors`
  onError(({ graphQLErrors, operation }) => {
    if (graphQLErrors?.length) {
      const { headers } = operation.getContext();
      handler(
        graphQLErrors.map(({ message, extensions, path }) => {
          const code = extensions?.['code'];
          return {
            message,
            code: typeof code === 'string' ? code : undefined,
            path,
          };
        }),
        getTraceToken(headers ?? {})
      );
    }
  });
