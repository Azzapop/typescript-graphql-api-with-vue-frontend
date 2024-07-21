import type { StatusCodes } from 'http-status-codes';

// Maintain a minimal subset of status error codes. Expand if needed
export type StatusErrorCode =
  | StatusCodes.INTERNAL_SERVER_ERROR
  | StatusCodes.UNAUTHORIZED
  | StatusCodes.BAD_REQUEST;

export type ApiErrorCode =
  | 'UNKNOWN'
  | 'MISSING_AUTH_HEADER'
  | 'MUST_BE_STRING_VALUE';

type BadRequestApiErrorDetail = {
  errorCode: 'MUST_BE_STRING_VALUE';
  paramType: 'body';
  locationPath: string;
};

type CustomApiErrorDetail = BadRequestApiErrorDetail;

type StandardApiErrorDetail = {
  errorCode: Exclude<ApiErrorCode, CustomApiErrorDetail['errorCode']>;
  paramType?: undefined;
  locationPath?: undefined;
};

export type ApiErrorDetail = StandardApiErrorDetail | CustomApiErrorDetail;
