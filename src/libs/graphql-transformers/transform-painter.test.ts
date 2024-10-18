import { createPainter } from '#test/prisma';
import { cuid } from '#test/utils';
import { expect, it } from 'vitest';
import { transformPainter } from './transform-painter';

it('returns the correctly formatted data on success', () => {
  const id = cuid();
  console.log(id);
  const painter = createPainter({
    id,
    country: 'Australia',
    name: 'Noodles',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(painter);
  const result = transformPainter(painter);
  expect(result).toEqual({
    id,
    country: 'Australia',
    name: 'Noodles',
    techniques: [],
  });
});

it('returns null if the data is invalid', () => {
  const painter = {};
  // @ts-expect-error Typecast to ensure test coverage
  const result = transformPainter(painter);
  expect(result).toEqual(null);
});
