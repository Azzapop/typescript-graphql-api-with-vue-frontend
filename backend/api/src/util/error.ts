import { StatusCodes, getReasonPhrase } from 'http-status-codes';

// Maintain a minimal subset of status error codes. Expand if needed
type StatusErrorCode = StatusCodes.INTERNAL_SERVER_ERROR;

export type ApiErrorCode = 'UNKNOWN';

const API_ERROR_CLASS_NAME = 'ApiError';

export class ApiError extends Error {
  public statusCode: StatusErrorCode;
  public errorCodes: Array<ApiErrorCode>;

  constructor(statusCode: StatusErrorCode, errorCodes: Array<ApiErrorCode>) {
    const message = getReasonPhrase(statusCode);
    super(message);

    this.name = API_ERROR_CLASS_NAME;
    this.statusCode = statusCode;
    this.errorCodes = errorCodes;
  }
}

// Explicit unknown to allow us to validate anything
export const isApiError = (err: unknown): err is ApiError => {
  return err instanceof Error && err.name === API_ERROR_CLASS_NAME;
};
