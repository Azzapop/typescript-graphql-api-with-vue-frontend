import type { Handler } from 'express';
import passport from 'passport';

export const authenticateAccessToken = (): Handler =>
  passport.authenticate('access-token');
