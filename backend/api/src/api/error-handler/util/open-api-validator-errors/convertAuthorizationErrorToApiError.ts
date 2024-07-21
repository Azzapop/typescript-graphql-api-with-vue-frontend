import type { Unauthorized } from 'express-openapi-validator/dist/framework/types';
import { ApiError } from '../api-errors/ApiError';
import type { ApiErrorDetail } from '../api-errors/types';

export const convertAuthorizationErrorToApiError = (
  err: Unauthorized
): ApiError => {
  const { status: statusCode, errors } = err;

  const errorCodes: Array<ApiErrorDetail> = errors.map((_err) => {
    const { message } = _err;

    if (message === 'Authorization header required') {
      return { errorCode: 'MISSING_AUTH_HEADER' };
    }

    console.error('Received an unknown api validation error', {
      message,
      _err,
    });

    return { errorCode: 'UNKNOWN' };
  });

  return new ApiError(statusCode, errorCodes);
};
