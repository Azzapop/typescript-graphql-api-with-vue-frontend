import { faker } from '@faker-js/faker';
import type { RefreshToken } from '~libs/domain-model';
import { cuid } from '#test/utils';

export const createTestRefreshToken = (
  overrides?: Partial<RefreshToken>
): RefreshToken => ({
  id: cuid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});
