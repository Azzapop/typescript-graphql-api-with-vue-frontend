import chalk from 'chalk';

export const log = (msg: string): void => {
  console.log(chalk.bgWhite(chalk.black('[LOG]')) + ' ' + chalk.white(msg));
};
