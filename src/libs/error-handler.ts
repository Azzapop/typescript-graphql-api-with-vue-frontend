import type { ErrorRequestHandler } from 'express';
import { logger } from '~libs/logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error('Unhandled error: %o', err);
  res
    .status(500)
    .json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
};
