// Explicit unknown to allow us to validate anything
export const isStandardError = (err: unknown): err is Error => {
  return err instanceof Error;
};
