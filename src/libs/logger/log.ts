import chalk from 'chalk';

export const log = (msg: string): void => {
  console.log(chalk.bgWhite('[LOG]') + ' ' + chalk.white(msg));
};
