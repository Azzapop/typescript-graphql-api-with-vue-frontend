import type {
  HttpError,
  Unauthorized,
} from 'express-openapi-validator/dist/framework/types';
import { StatusCodes } from 'http-status-codes';

export const isAuthorizationError = (err: HttpError): err is Unauthorized => {
  return err.status === StatusCodes.UNAUTHORIZED && err.name === 'Unauthorized';
};
