// Use function definition here as asserts doesn't work with const expressions
// eslint-disable-next-line func-style
export function assert<T>(t: T): asserts t is NonNullable<T> {
  if (t === undefined || t === null) {
    throw new Error('Expected value to be defined.');
  }
}
