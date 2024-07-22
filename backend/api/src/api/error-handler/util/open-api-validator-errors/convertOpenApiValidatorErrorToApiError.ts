import type { HttpError } from 'express-openapi-validator/dist/framework/types';
import type { ApiError } from '../api-errors/ApiError';
import { convertAuthorizationErrorToApiError } from './convertAuthorizationErrorToApiError';
import { convertBadRequestErrorToApiError } from './convertBadRequestErrorToApiError';
import { convertUnknownHttpErrorToApiError } from './convertUnknownHttpErrorToApiError';
import { isAuthorizationError } from './isAuthorizationError';
import { isBadRequestError } from './isBadRequestError';

export const convertOpenApiValidatorErrorToApiError = (
  err: HttpError
): ApiError => {

  if (isAuthorizationError(err)) {
    return convertAuthorizationErrorToApiError(err);
  }

  if (isBadRequestError(err)) {
    return convertBadRequestErrorToApiError(err);
  }

  return convertUnknownHttpErrorToApiError(err);
};
