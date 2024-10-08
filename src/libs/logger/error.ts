import chalk from 'chalk';

export const error = (msg: string): void => {
  console.log(chalk.bgRed('[ERROR]') + ' ' + chalk.red(msg));
};
