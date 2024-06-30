import type { BadRequest } from 'express-openapi-validator/dist/framework/types';
import { ApiError } from '../api-errors/ApiError';
import type { ApiErrorDetail } from '../api-errors/types';

const isValidParamType = (val?: string): val is NonNullable<ApiErrorDetail['paramType']> => {
  return val === 'body'
}

export const convertBadRequestErrorToApiError = (err: BadRequest): ApiError => {
  const { status: statusCode, errors } = err;

  const errorCodes: Array<ApiErrorDetail> = errors.map((_err) => {
    const { path, message } = _err;
    const [paramType, ...location] = path.split('/').filter((s) => s);
    const locationPath = location.join('.');

    if (isValidParamType(paramType)) {
      if (message === 'must be string') {
        return { errorCode: 'MUST_BE_STRING_VALUE', paramType, locationPath };
      }
    }

    console.error('Received an unknown api validation error', {
      message,
      _err,
    });

    return { errorCode: 'UNKNOWN' };
  });

  return new ApiError(statusCode, errorCodes);
};
