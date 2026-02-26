import type { Handler } from 'express';

export const validateLoginBody: Handler = ({ body }, res, next) => {
  const { username, password } = body;

  if (!username || !password) {
    res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Username and password are required',
    });
    return;
  }

  next();
};
