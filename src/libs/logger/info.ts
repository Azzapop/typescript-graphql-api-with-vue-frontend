import chalk from 'chalk';
import { getTraceContext } from '~libs/trace-context';

export const info = (msg: string): void => {
  const { traceToken } = getTraceContext();
  const prefix = traceToken ? `[${traceToken}] ` : '';
  console.log(
    chalk.bgBlue(chalk.black('[INFO]')) + ' ' + chalk.blue(prefix + msg)
  );
};
