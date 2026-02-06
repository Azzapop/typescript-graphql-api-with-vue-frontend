import type { Handler } from 'express';
import type { Strategy } from 'passport';
import { accessTokenStrategy, accessTokenMiddleware } from './access-token';
import { localStrategy, localMiddleware } from './local';
import { refreshTokenStrategy, refreshTokenMiddleware } from './refresh-token';

type StrategyObj = {
  strategy: Strategy;
  middleware: Handler;
};

// TODO enforce kebab type keys
type StrategyRegister = Record<string, StrategyObj>;

export const registry = {
  local: {
    strategy: localStrategy,
    middleware: localMiddleware,
  },
  'access-token': {
    strategy: accessTokenStrategy,
    middleware: accessTokenMiddleware,
  },
  'refresh-token': {
    strategy: refreshTokenStrategy,
    middleware: refreshTokenMiddleware,
  },
} as const satisfies StrategyRegister;
