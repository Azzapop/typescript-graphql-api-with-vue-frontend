import { getTraceContext } from '~libs/trace-context';
import * as log from './log';

const buildMessage = (msg: string): string => {
  const { traceToken } = getTraceContext();
  return `[${traceToken}] ${msg}`;
};

export const request = {
  info: (msg: string): void => log.info(buildMessage(msg)),
  error: (msg: string): void => log.error(buildMessage(msg)),
  log: (msg: string): void => log.log(buildMessage(msg)),
};
