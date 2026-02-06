import type { Handler } from 'express';
import passport from 'passport';

export const refreshTokenMiddleware: Handler =
  passport.authenticate('refresh-token');
