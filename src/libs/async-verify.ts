/*
 * Use this helper to wrap async Passport verify callbacks and ensure
 * their errors are forwarded to done(err) instead of becoming
 * unhandled promise rejections.
 *
 * Passport strategies use a done(err, user) callback pattern but do
 * not handle promises returned by async verify functions. This wrapper
 * catches any rejected promise and calls done(err) so the error
 * propagates through Express error handling.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const asyncVerify = <T extends (...args: any[]) => Promise<any>>(
  fn: T
): ((...args: Parameters<T>) => void) => {
  const wrapper = (...args: Parameters<T>): void => {
    const done = args[args.length - 1] as (err: any, ...rest: any[]) => void;
    fn(...args).catch((err: unknown) => done(err));
  };

  return wrapper;
};
/* eslint-enable @typescript-eslint/no-explicit-any */
