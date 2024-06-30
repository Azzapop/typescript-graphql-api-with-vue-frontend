import type { HttpError } from 'express-openapi-validator/dist/framework/types';
import { ApiError } from '../api-errors/ApiError';

export const convertUnknownHttpErrorToApiError = (err: HttpError): ApiError => {
  const { status: statusCode, message } = err;
  console.error('Received an unknown api validation error', { message });
  return new ApiError(statusCode, [{ errorCode: 'UNKNOWN' }]);
};
