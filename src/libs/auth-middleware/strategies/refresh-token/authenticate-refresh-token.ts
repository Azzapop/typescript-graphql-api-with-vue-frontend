import type { Handler } from 'express';
import passport from 'passport';
import { logger } from '~libs/logger';

export const authenticateRefreshToken = (): Handler => (req, res, next) => {
  passport.authenticate(
    'refresh-token',
    (err: unknown, user: Express.User, _info: unknown) => {
      // TODO log info here when safely redacting information

      if (err) {
        logger.error('Error verifying refresh token');
        return next(err);
      }

      if (!user) {
        logger.error('Unable to authenticate a user via refresh-token');
        return next();
      }

      // We're officially logged in. Set the user on the req and continue to handle tokens
      req.user = user;
      req.issueNewTokens = true;
      return next();
    }
  )(req, res, next);
};
