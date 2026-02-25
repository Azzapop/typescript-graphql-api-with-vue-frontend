import { defineUserFactory, defineUserProfileFactory } from '#test/factories';
import { cleanWorkerDatabase } from '#test/integration';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { getByUserId } from '../get-by-user-id';

const setup = () => ({
  UserFactory: defineUserFactory(),
  UserProfileFactory: defineUserProfileFactory({
    defaultData: { user: defineUserFactory() },
  }),
});

describe('getByUserId (integration)', () => {
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

    expect(result).toMatchObject({
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

    expect(result).not.toBeNull();
    expect(result?.email).toBeNull();
  });

  it('returns null when user has no profile', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const result = await getByUserId(user.id);

    expect(result).toBeNull();
  });

  it('returns null for a non-existent userId', async () => {
    const result = await getByUserId(faker.string.uuid());

    expect(result).toBeNull();
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

    expect(result1?.id).toBe(profile1.id);
    expect(result1?.email).toBe(profile1.email);

    expect(result2?.id).toBe(profile2.id);
    expect(result2?.email).toBe(profile2.email);

    expect(result3?.id).toBe(profile3.id);
    expect(result3?.email).toBeNull();
  });
});
