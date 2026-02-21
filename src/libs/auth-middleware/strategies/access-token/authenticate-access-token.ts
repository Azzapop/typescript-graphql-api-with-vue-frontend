import type { Handler } from 'express';
import passport from 'passport';
import { logger } from '~libs/logger';

export const authenticateAccessToken = (): Handler => (req, res, next) => {
  passport.authenticate(
    'access-token',
    (err: unknown, user: Express.User, _info: unknown) => {
      // TODO log info here when safely redacting information

      if (err) {
        logger.error('Error verifying access token');
        // TODO log error here when safely redacting information
        return next();
      }

      if (!user) {
        logger.error('Unable to authenticate a user via access-token');
        return next();
      }

      // We're officially logged in. Set the user on the req and continue
      req.user = user;
      return next();
    }
  )(req, res, next);
};
