import chalk from 'chalk';

export const info = (msg: string): void => {
  console.log(chalk.bgBlue(chalk.black('[INFO]')) + ' ' + chalk.blue(msg));
};
