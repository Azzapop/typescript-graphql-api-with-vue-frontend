import type { ApiError } from '../../util/api-errors/ApiError';

export const convertApiErrortoErrorResponse = (err: ApiError): unknown => {
  const { message, errorDetails } = err;
  return {
    message,
    errorDetails,
  };
};
