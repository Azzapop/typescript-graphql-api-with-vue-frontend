import { ApiError } from "./api-errors/ApiError";

export const convertApiErrortoErrorResponse = (err: ApiError): unknown => {
  const { message, errorDetails } = err;
  return {
    message,
    errorDetails,
  };
};
