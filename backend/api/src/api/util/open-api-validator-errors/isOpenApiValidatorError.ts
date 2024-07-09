import type { HttpError } from 'express-openapi-validator/dist/framework/types';
import { isStandardError } from '../isStandardError';

// Explicit unknown to allow us to validate anything
export const isOpenApiValidatorError = (err: unknown): err is HttpError => {
  // Best we can do for now as it always implements these two keys from the ValidationError
  return isStandardError(err) && 'status' in err && 'errors' in err;
};
