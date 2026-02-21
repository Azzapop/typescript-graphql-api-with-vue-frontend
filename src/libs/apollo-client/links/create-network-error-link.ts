import { onError } from '@apollo/client/link/error';
import { TRACE_TOKEN_HEADER } from '~libs/trace-token';
import type { ClientLink, NetworkErrorInfo } from '../apollo-client-types';

const hasStatusCode = (error: Error): error is Error & { statusCode: number } =>
  'statusCode' in error;

const getTraceToken = (
  headers: Record<string, unknown>
): string | undefined => {
  const { [TRACE_TOKEN_HEADER]: traceToken } = headers;
  return typeof traceToken === 'string' ? traceToken : undefined;
};

export const createNetworkErrorLink = (
  handler: (error: NetworkErrorInfo, traceToken: string | undefined) => void
): ClientLink =>
  // TODO: upgrade to Apollo Client v4 and use the `error` property instead of `networkError`
  onError(({ networkError, operation }) => {
    if (networkError) {
      const { headers } = operation.getContext();
      handler(
        {
          message: networkError.message,
          statusCode: hasStatusCode(networkError)
            ? networkError.statusCode
            : undefined,
        },
        getTraceToken(headers ?? {})
      );
    }
  });
