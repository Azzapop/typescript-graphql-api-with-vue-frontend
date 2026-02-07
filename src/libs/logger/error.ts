import chalk from 'chalk';
import { getTraceContext } from '~libs/trace-context';

export const error = (msg: string): void => {
  const { traceToken } = getTraceContext();
  const prefix = traceToken ? `[${traceToken}] ` : '';
  console.log(
    chalk.bgRed(chalk.black('[ERROR]')) + ' ' + chalk.red(prefix + msg)
  );
};
