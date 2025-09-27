/**
 * Makes all properties of a type mutable (removes readonly).
 * Useful for converting readonly arrays or objects to mutable versions for APIs that require mutation.
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
