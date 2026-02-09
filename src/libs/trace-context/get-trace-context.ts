import type { TraceContext } from './trace-storage';
import { traceStorage } from './trace-storage';

export const getTraceContext = (): TraceContext => {
  const traceContext = traceStorage.getStore();
  if (!traceContext) {
    throw new Error('Using trace context without initialisation.');
  }
  return traceContext;
};
