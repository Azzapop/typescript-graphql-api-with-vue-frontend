import { defineRefreshTokenFactory, defineUserFactory } from '#test/factories';
import { cleanWorkerDatabase } from '#test/integration';
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

    const youngest = await RefreshTokenStore.findYoungest(user.id);

    expect(youngest).toEqual(token);
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

    const youngest = await RefreshTokenStore.findYoungest(user.id);

    expect(youngest?.id).toBe(token3.id);
  });

  it('returns null when the user has no tokens', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const youngest = await RefreshTokenStore.findYoungest(user.id);

    expect(youngest).toBeNull();
  });

  it('returns null for a non-existent user id', async () => {
    const youngest = await RefreshTokenStore.findYoungest(
      'non-existent-user-id'
    );

    expect(youngest).toBeNull();
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

    const user1Youngest = await RefreshTokenStore.findYoungest(user1.id);
    const user2Youngest = await RefreshTokenStore.findYoungest(user2.id);

    expect(user1Youngest?.id).toBe(user1Token2.id);
    expect(user2Youngest?.id).toBe(user2Token3.id);
  });
});
