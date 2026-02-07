import chalk from 'chalk';
import { getTraceContext } from '~libs/trace-context';

export const log = (msg: string): void => {
  const { traceToken } = getTraceContext();
  const prefix = traceToken ? `[${traceToken}] ` : '';
  console.log(
    chalk.bgWhite(chalk.black('[LOG]')) + ' ' + chalk.white(prefix + msg)
  );
};
