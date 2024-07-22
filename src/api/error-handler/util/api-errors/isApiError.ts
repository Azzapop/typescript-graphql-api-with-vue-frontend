import { isStandardError } from '../isStandardError';
import type { ApiError } from './ApiError';
import { API_ERROR_CLASS_NAME } from './const';

// Explicit unknown to allow us to validate anything
export const isApiError = (err: unknown): err is ApiError => {
  return isStandardError(err) && err.name === API_ERROR_CLASS_NAME;
};
