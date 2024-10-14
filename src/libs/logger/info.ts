import chalk from 'chalk';

export const info = (msg: string): void => {
  console.log(chalk.bgBlue('[INFO]' + ' ' + chalk.blue(msg)));
};
