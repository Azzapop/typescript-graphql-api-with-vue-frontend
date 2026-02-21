import { faker } from '@faker-js/faker';
import type { UserProfile } from '@prisma/client';
import { cuid } from '#test/utils';

export const createTestUserProfile = (
  overrides?: Partial<UserProfile>
): UserProfile => ({
  id: cuid(),
  userId: cuid(),
  email: faker.internet.email(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});
