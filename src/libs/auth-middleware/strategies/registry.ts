import type { Handler } from 'express';
import type { Strategy } from 'passport';
import { accessTokenStrategy, authenticateAccessToken } from './access-token';
import {
  clientCredentialsStrategy,
  authenticateClientCredentials,
} from './client-credentials';
import {
  localCredentialsStrategy,
  authenticateLocalCredentials,
} from './local-credentials';
import {
  refreshTokenStrategy,
  authenticateRefreshToken,
} from './refresh-token';

type StrategyObj = {
  strategy: Strategy;
  middleware: () => Handler;
};

// TODO enforce kebab type keys
type StrategyRegister = Record<string, StrategyObj>;

export const registry = {
  'local-credentials': {
    strategy: localCredentialsStrategy,
    middleware: authenticateLocalCredentials,
  },
  'access-token': {
    strategy: accessTokenStrategy,
    middleware: authenticateAccessToken,
  },
  'refresh-token': {
    strategy: refreshTokenStrategy,
    middleware: authenticateRefreshToken,
  },
  'client-credentials': {
    strategy: clientCredentialsStrategy,
    middleware: authenticateClientCredentials,
  },
} as const satisfies StrategyRegister;
