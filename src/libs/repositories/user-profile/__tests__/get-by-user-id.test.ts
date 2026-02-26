import { cleanWorkerDatabase } from '#test';
import { defineUserFactory, defineUserProfileFactory } from '#test/factories';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { getByUserId } from '../get-by-user-id';

const setup = () => ({
  UserFactory: defineUserFactory(),
  UserProfileFactory: defineUserProfileFactory({
    defaultData: { user: defineUserFactory() },
  }),
});

describe('getByUserId', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('returns the profile when it exists (with email set)', async () => {
    const { UserFactory, UserProfileFactory } = setup();
    const user = await UserFactory.create();
    const profile = await UserProfileFactory.create({
      user: { connect: { id: user.id } },
      email: faker.internet.email(),
    });

    const result = await getByUserId(user.id);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toMatchObject({
      id: profile.id,
      userId: user.id,
      email: profile.email,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('returns the profile when email is null', async () => {
    const { UserFactory, UserProfileFactory } = setup();
    const user = await UserFactory.create();
    await UserProfileFactory.create({
      user: { connect: { id: user.id } },
      email: null,
    });

    const result = await getByUserId(user.id);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).not.toBeNull();
    expect(result.data?.email).toBeNull();
  });

  it('returns success with null when user has no profile', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const result = await getByUserId(user.id);

    expect(result).toEqual({ success: true, data: null });
  });

  it('returns success with null for a non-existent userId', async () => {
    const result = await getByUserId(faker.string.uuid());

    expect(result).toEqual({ success: true, data: null });
  });

  it('returns the correct profile for each user when multiple exist', async () => {
    const { UserFactory, UserProfileFactory } = setup();
    const user1 = await UserFactory.create();
    const user2 = await UserFactory.create();
    const user3 = await UserFactory.create();

    const profile1 = await UserProfileFactory.create({
      user: { connect: { id: user1.id } },
      email: faker.internet.email(),
    });
    const profile2 = await UserProfileFactory.create({
      user: { connect: { id: user2.id } },
      email: faker.internet.email(),
    });
    const profile3 = await UserProfileFactory.create({
      user: { connect: { id: user3.id } },
      email: null,
    });

    const result1 = await getByUserId(user1.id);
    const result2 = await getByUserId(user2.id);
    const result3 = await getByUserId(user3.id);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result3.success).toBe(true);
    if (!result1.success || !result2.success || !result3.success) return;

    expect(result1.data?.id).toBe(profile1.id);
    expect(result1.data?.email).toBe(profile1.email);

    expect(result2.data?.id).toBe(profile2.id);
    expect(result2.data?.email).toBe(profile2.email);

    expect(result3.data?.id).toBe(profile3.id);
    expect(result3.data?.email).toBeNull();
  });
});
