import type {
  BadRequest,
  HttpError,
} from 'express-openapi-validator/dist/framework/types';
import { StatusCodes } from 'http-status-codes';

export const isBadRequestError = (err: HttpError): err is BadRequest => {
  return err.status === StatusCodes.BAD_REQUEST && err.name === 'Bad Request';
};
