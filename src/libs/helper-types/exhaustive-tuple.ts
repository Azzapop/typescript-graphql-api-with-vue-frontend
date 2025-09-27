// Generic type to enforce exhaustive tuples
// Mostly just used to ensure tuples of options for union types are exhaustive

export type ExhaustiveTuple<
  T extends readonly string[],
  Template extends { value: T[number] },
> = {
  [K in keyof T]: T[K] extends string
    ? Omit<Template, 'value'> & { value: T[K] }
    : never;
};
