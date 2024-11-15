export function assert<T>(t: T): asserts t is NonNullable<T> {
  if (t === undefined || t === null) {
    throw new Error('Expected value to be defined.');
  }
}
