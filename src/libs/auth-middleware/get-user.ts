import type { Handler } from 'express';
import { logger } from '~libs/logger';

export const getUser = (): Handler => (req, _res, next) => {
  const { user } = req;
  if (!user) {
    logger.error(
      'getUser() called without authenticated user - this should be unreachable'
    );
    throw new Error(
      'Unreachable: no user present after authenticate() middleware'
    );
  }
  req.getUser = () => user;
  next();
};
