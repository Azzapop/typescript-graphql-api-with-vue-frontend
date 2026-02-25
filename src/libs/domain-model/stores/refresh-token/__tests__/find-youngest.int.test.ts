import { defineRefreshTokenFactory, defineUserFactory } from '#test/factories';
import { cleanWorkerDatabase } from '#test/integration';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import * as RefreshTokenStore from '../find-youngest';

const setup = () => ({
  UserFactory: defineUserFactory(),
  RefreshTokenFactory: defineRefreshTokenFactory({
    defaultData: { user: defineUserFactory() },
  }),
});

describe('RefreshTokenStore.findYoungest (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('returns the only token when one exists', async () => {
    const { UserFactory, RefreshTokenFactory } = setup();
    const user = await UserFactory.create();
    const token = await RefreshTokenFactory.create({
      user: { connect: { id: user.id } },
    });

    const result = await RefreshTokenStore.findYoungest(user.id);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toEqual(token);
  });

  it('returns the most recently created token when multiple exist', async () => {
    const { UserFactory, RefreshTokenFactory } = setup();
    const user = await UserFactory.create();

    await RefreshTokenFactory.create({ user: { connect: { id: user.id } } });
    await new Promise((resolve) => setTimeout(resolve, 10));

    await RefreshTokenFactory.create({ user: { connect: { id: user.id } } });
    await new Promise((resolve) => setTimeout(resolve, 10));

    const token3 = await RefreshTokenFactory.create({
      user: { connect: { id: user.id } },
    });

    const result = await RefreshTokenStore.findYoungest(user.id);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data?.id).toBe(token3.id);
  });

  it('returns success with null when the user has no tokens', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const result = await RefreshTokenStore.findYoungest(user.id);

    expect(result).toEqual({ success: true, data: null });
  });

  it('returns success with null for a non-existent user id', async () => {
    const result = await RefreshTokenStore.findYoungest(
      faker.string.uuid()
    );

    expect(result).toEqual({ success: true, data: null });
  });

  it('returns the correct youngest per user independently', async () => {
    const { UserFactory, RefreshTokenFactory } = setup();
    const user1 = await UserFactory.create();
    const user2 = await UserFactory.create();

    await RefreshTokenFactory.create({ user: { connect: { id: user1.id } } });
    await new Promise((resolve) => setTimeout(resolve, 10));
    const user1Token2 = await RefreshTokenFactory.create({
      user: { connect: { id: user1.id } },
    });

    await RefreshTokenFactory.create({ user: { connect: { id: user2.id } } });
    await new Promise((resolve) => setTimeout(resolve, 10));
    await RefreshTokenFactory.create({ user: { connect: { id: user2.id } } });
    await new Promise((resolve) => setTimeout(resolve, 10));
    const user2Token3 = await RefreshTokenFactory.create({
      user: { connect: { id: user2.id } },
    });

    const result1 = await RefreshTokenStore.findYoungest(user1.id);
    const result2 = await RefreshTokenStore.findYoungest(user2.id);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    if (!result1.success || !result2.success) return;

    expect(result1.data?.id).toBe(user1Token2.id);
    expect(result2.data?.id).toBe(user2Token3.id);
  });
});
