import { isStandardError } from './isStandardError';

it('returns true for an Error', () => {
  const error = new Error('An error');
  expect(isStandardError(error)).toBeTruthy();
});

it('returns false for anything else', () => {
  const error = { error: 'An error' };
  expect(isStandardError(error)).toBeFalsy();
});
