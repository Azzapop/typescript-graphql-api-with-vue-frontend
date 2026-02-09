import { AsyncLocalStorage } from 'node:async_hooks';

export interface TraceContext {
  traceToken: string;
}

export const traceStorage = new AsyncLocalStorage<TraceContext>();
