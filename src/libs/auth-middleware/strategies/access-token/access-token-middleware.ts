import type { Handler } from 'express';
import passport from 'passport';

export const accessTokenMiddleware: Handler =
  passport.authenticate('access-token');
