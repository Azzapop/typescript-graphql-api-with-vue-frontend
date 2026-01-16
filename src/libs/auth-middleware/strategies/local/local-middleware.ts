import type { Handler } from 'express';
import passport from 'passport';
import { logger } from '~libs/logger';

export const localMiddleware: Handler = (req, res, next) => {
  passport.authenticate(
    'local',
    (err: unknown, user: Express.User, _info: unknown) => {
      // TODO log info here when safely redacting information

      if (err) {
        logger.error('Error verifying local credentials');
        // TODO log error here when safely redacting information
        return next();
      }

      if (!user) {
        logger.error('Unable to authenticate a user');
        return next();
      }

      return req.login(user, (loginErr) => {
        if (loginErr) {
          logger.info('Unable to log the user in to the application');
          // TODO log error here when safely redacting information
        }
        return next();
      });
    }
  )(req, res, next);
};
