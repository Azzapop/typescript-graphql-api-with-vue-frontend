import { ApiError } from './ApiError';
import { isApiError } from './isApiError';

it('returns true for an ApiError', () => {
  const error = new ApiError(500, [{ errorCode: 'UNKNOWN' }]);
  expect(isApiError(error)).toBeTruthy();
});

it('returns false for any other error', () => {
  const error = new Error();
  expect(isApiError(error)).toBeFalsy();
});
