import pino from 'pino';
import { getTraceContext } from '~libs/trace-context';

// Set up the logger
export const logger = pino(
  {
    level: 'info', // TODO log level via config
    transport: {
      target: 'pino-pretty', // TODO set transport based on config and env
      options: {
        colorize: true, // TODO Add colors to the logs only in dev
      },
    },
    mixin: () => {
      return getTraceContext() ?? {};
    },
  },
  pino.destination('./logs/app.log')
);
