import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../util/api-errors/ApiError';
import { isApiError } from '../util/api-errors/isApiError';
import { isStandardError } from '../util/isStandardError';
import { convertOpenApiValidatorErrorToApiError } from '../util/open-api-validator-errors/convertOpenApiValidatorErrorToApiError';
import { isOpenApiValidatorError } from '../util/open-api-validator-errors/isOpenApiValidatorError';
import { convertApiErrortoErrorResponse } from './util/convertApiErrorToErrorResponse';

let verifiedError: ApiError | null = null;
const setVerifiedError = (err: ApiError): void => {
  if (verifiedError) return;
  verifiedError = err;
};
const getVerifiedErrorOrUnknownError = (): ApiError => {
  if (verifiedError) return verifiedError;

  return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, [
    { errorCode: 'UNKNOWN' },
  ]);
};

// Cast `err` to 'unknown' here as 'any' is the default for the 'ErrorRequestHandler'
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  _next // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  // Log it
  if (isStandardError(err)) {
    const { message } = err;
    console.error({ message, err });
  } else {
    console.error('Non error object received:', { err });
  }

  // If it's an error we threw ourselves, save it to return later
  if (isApiError(err)) {
    setVerifiedError(err);
  }

  // If it's an error from our swagger validation, convert it to our own and save it
  if (isOpenApiValidatorError(err)) {
    const openApiError = convertOpenApiValidatorErrorToApiError(err);
    setVerifiedError(openApiError);
  }

  // Get our saved error, or an unknown error if we weren't able to save one
  const finalError = getVerifiedErrorOrUnknownError();

  // TODO create a handler to ensure we don't put extra params in the response
  res
    .status(finalError.statusCode)
    .json(convertApiErrortoErrorResponse(finalError));
};
