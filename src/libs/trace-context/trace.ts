import type { Handler } from 'express';
import { TRACE_TOKEN_HEADER, generateTraceToken } from '~libs/trace-token';
import { runWithTrace } from './run-with-trace';
import type { TraceContext } from './trace-storage';

const getTraceTokenFromHeader = (
  header: string | string[] | undefined
): string => {
  if (typeof header === 'string') {
    return header;
  }

  return header?.[0] ?? generateTraceToken();
};

export const trace = (appName: string): Handler => {
  return (req, res, next) => {
    const {
      headers: { [TRACE_TOKEN_HEADER]: traceTokenHeader },
    } = req;
    const traceToken = getTraceTokenFromHeader(traceTokenHeader);

    // Set trace token on response header for client visibility
    res.setHeader(TRACE_TOKEN_HEADER, traceToken);

    const traceContext: TraceContext = {
      appName,
      traceToken,
    };
    runWithTrace(traceContext, () => {
      next();
    });
  };
};
