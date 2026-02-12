import chalk from 'chalk';

type Level = 'info' | 'error' | 'log';

const levelConfig = {
  info: { bg: chalk.bgBlue, fg: chalk.blue, label: '[INFO]' },
  error: { bg: chalk.bgRed, fg: chalk.red, label: '[ERROR]' },
  log: { bg: chalk.bgWhite, fg: chalk.white, label: '[LOG]' },
} as const;

const write = (level: Level, msg: string): void => {
  const { [level]: config } = levelConfig;
  console.log(config.bg(chalk.black(config.label)) + ' ' + config.fg(msg));
};

export const info = (msg: string): void => write('info', msg);
export const error = (msg: string): void => write('error', msg);
export const log = (msg: string): void => write('log', msg);
