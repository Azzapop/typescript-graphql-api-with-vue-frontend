import chalk from 'chalk';

export const error = (msg: string): void => {
  console.log(chalk.bgRed(chalk.black('[ERROR]')) + ' ' + chalk.red(msg));
};
