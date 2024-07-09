import { getReasonPhrase } from 'http-status-codes';
import { API_ERROR_CLASS_NAME } from './const';
import type { ApiErrorDetail, StatusErrorCode } from './types';

export class ApiError extends Error {
  public statusCode: StatusErrorCode;
  public errorDetails: Array<ApiErrorDetail>;

  constructor(
    statusCode: StatusErrorCode,
    errorDetails: Array<ApiErrorDetail>
  ) {
    const message = getReasonPhrase(statusCode);
    super(message);

    this.name = API_ERROR_CLASS_NAME;
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}
