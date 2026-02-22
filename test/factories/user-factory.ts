import { faker } from '@faker-js/faker';
import type { User } from '~libs/domain-model';
import { cuid } from '#test/utils';

export const createTestUser = (overrides?: Partial<User>): User => ({
  id: cuid(),
  tokenVersion: faker.string.uuid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});
