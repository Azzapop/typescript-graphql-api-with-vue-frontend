import type { Handler } from 'express';
import passport from 'passport';
import { logger } from '~libs/logger';

export const authenticateLocalCredentials = (): Handler => (req, res, next) => {
  passport.authenticate(
    'local-credentials',
    (err: unknown, user: Express.User, _info: unknown) => {
      // TODO log info here when safely redacting information

      if (err) {
        logger.error('Error verifying local credentials');
        return next(err);
      }

      if (!user) {
        logger.error('Unable to authenticate a user via local-credentials');
        return next();
      }

      // We're officially logged in. Set the user on the req and continue to handler tokens
      req.user = user;
      return next();
    }
  )(req, res, next);
};
