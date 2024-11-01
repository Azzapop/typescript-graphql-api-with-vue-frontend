import { createGqlPainterInput } from '#test/graphql';
import { logger } from '@libs/logger';
import { expect, it } from 'vitest';
import { transformPainterInput } from './transform-painter-input';

it('returns the correctly formatted data on success', () => {
  const gqlPainterInput = createGqlPainterInput({
    country: 'Australia',
    name: 'Noodles',
    techniques: ['cuid-abc-123'],
  });
  const result = transformPainterInput(gqlPainterInput);
  expect(result).toEqual({
    country: 'Australia',
    name: 'Noodles',
    painterTechniques: {
      create: [{ techniqueId: 'cuid-abc-123' }],
    },
  });
});

it('returns null if the data is invalid', () => {
  const gqlPainterInput = {};
  // @ts-expect-error Typecast to ensure test coverage
  const result = transformPainterInput(gqlPainterInput);
  expect(result).toEqual(null);
});
