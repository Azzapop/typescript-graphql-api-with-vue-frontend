import type { TraceContext } from './trace-storage';
import { traceStorage } from './trace-storage';

export const runWithTrace = <T>(traceContext: TraceContext, fn: () => T): T => {
  return traceStorage.run(traceContext, fn);
};
