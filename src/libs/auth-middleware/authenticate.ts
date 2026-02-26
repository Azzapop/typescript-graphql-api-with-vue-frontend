import type { Handler } from 'express';
import { asyncHandler } from '~libs/async-handler';
import { apiFailedAuthenticate } from './api-failed-authenticate';
import { clientFailedAuthenticate } from './client-failed-authenticate';
import { getUser } from './get-user';
import { handleTokens } from './handle-tokens';
import { registry } from './strategies';

type StrategyName = keyof typeof registry;

type RejectOptions = { onFailure: 'reject' };

type RedirectOptions = {
  onFailure: 'redirect';
  isPublicRoute: (path: string) => boolean;
  loginPath: string;
};

export const authenticate = (
  strategy: StrategyName,
  options: RejectOptions | RedirectOptions
): Array<Handler> => {
  const {
    [strategy]: { middleware: strategyMiddleware },
  } = registry;
  const base = [
    asyncHandler(strategyMiddleware()),
    asyncHandler(handleTokens()),
  ];

  if (options.onFailure === 'reject') {
    return [...base, apiFailedAuthenticate(), getUser()];
  }

  const { isPublicRoute, loginPath } = options;
  return [...base, clientFailedAuthenticate({ isPublicRoute, loginPath })];
};
