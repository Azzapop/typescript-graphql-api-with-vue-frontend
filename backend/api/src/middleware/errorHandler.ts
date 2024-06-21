import { ErrorRequestHandler } from 'express';
import { isApiError, ApiErrorCode } from '../util/error';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

// Cast `err` to 'unknown' here as 'any' is the default for the 'ErrorRequestHandler'
export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res) => {
  // If it's an error we threw ourselves, return it
  if (isApiError(err)) {
    res.status(err.statusCode).json({
      message: err.message,
      errorCodes: err.errorCodes,
    });
  }

  // TODO handle swagger validator errors. Maybe do that in middleware?

  // Otherwise we don't know what the error is, so log it and return an INTERNAL_SERVER_ERROR
  console.error('Unknown error received', { err });

  const unknownStatusErrorCode = StatusCodes.INTERNAL_SERVER_ERROR;
  const unknownErrorMessage = getReasonPhrase(unknownStatusErrorCode);
  const unknownApiErrorCodes: Array<ApiErrorCode> = ['UNKNOWN'];
  res.status(unknownStatusErrorCode).json({
    message: unknownErrorMessage,
    errorCodes: unknownApiErrorCodes,
  });
};
