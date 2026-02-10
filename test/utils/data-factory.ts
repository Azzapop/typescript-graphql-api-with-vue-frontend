import { GenerateMockOptions, generateMock } from '@anatine/zod-mock';
import { z } from 'zod';
// @ts-expect-error scuid has no types, it's a dependency of prisma
import scuid from 'scuid';

const defaultOptions: GenerateMockOptions = {
  stringMap: {
    // Generate valid CUIDs for id fields (zod-mock doesn't handle .cuid() validation)
    // Using scuid which generates cuid v1 format that zod's .cuid() validates against
    id: () => scuid(),
  },
};

export const dataFactory =
  <T extends z.ZodTypeAny>(schema: T) =>
  (overrides?: Partial<z.infer<T>>, options?: GenerateMockOptions) => ({
    ...generateMock(schema, {
      ...defaultOptions,
      ...options,
      stringMap: {
        ...defaultOptions.stringMap,
        ...options?.stringMap,
      },
    }),
    ...overrides,
  });
