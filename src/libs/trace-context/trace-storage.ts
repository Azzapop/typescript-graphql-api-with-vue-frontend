import { AsyncLocalStorage } from 'node:async_hooks';

export interface TraceContext {
  appName: string;
  traceToken: string;
}

export const traceStorage = new AsyncLocalStorage<TraceContext>();
