import type { TraceContext } from './trace-storage';
import { traceStorage } from './trace-storage';

export const getTraceContext = (): TraceContext | undefined => {
  return traceStorage.getStore();
};
