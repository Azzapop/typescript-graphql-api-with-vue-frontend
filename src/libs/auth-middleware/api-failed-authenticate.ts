import type { Handler } from 'express';

export const apiFailedAuthenticate = (): Handler => (req, res, next) => {
  const { user } = req;
  if (!user) {
    return res
      .status(401)
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
  }

  next();
};
