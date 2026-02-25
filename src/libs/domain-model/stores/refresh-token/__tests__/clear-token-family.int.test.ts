import { defineRefreshTokenFactory, defineUserFactory } from '#test/factories';
import { cleanWorkerDatabase } from '#test/integration';
import { prisma } from '~database';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearTokenFamily } from '../clear-token-family';

const setup = () => ({
  UserFactory: defineUserFactory(),
  RefreshTokenFactory: defineRefreshTokenFactory({
    defaultData: { user: defineUserFactory() },
  }),
});

describe('clearTokenFamily (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('deletes all tokens for a user', async () => {
    const { UserFactory, RefreshTokenFactory } = setup();
    const user = await UserFactory.create();

    await RefreshTokenFactory.create({ user: { connect: { id: user.id } } });
    await RefreshTokenFactory.create({ user: { connect: { id: user.id } } });
    await RefreshTokenFactory.create({ user: { connect: { id: user.id } } });

    await clearTokenFamily(user.id);

    const tokensAfter = await prisma().refreshToken.findMany({
      where: { userId: user.id },
    });
    expect(tokensAfter).toHaveLength(0);
  });

  it('succeeds when user has no tokens', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    await expect(clearTokenFamily(user.id)).resolves.toBeUndefined();
  });

  it('succeeds for non-existent user id', async () => {
    await expect(
      clearTokenFamily('non-existent-user-id')
    ).resolves.toBeUndefined();
  });

  it('only deletes tokens for the specified user', async () => {
    const { UserFactory, RefreshTokenFactory } = setup();
    const user1 = await UserFactory.create();
    const user2 = await UserFactory.create();

    await RefreshTokenFactory.create({ user: { connect: { id: user1.id } } });
    await RefreshTokenFactory.create({ user: { connect: { id: user1.id } } });

    await RefreshTokenFactory.create({ user: { connect: { id: user2.id } } });
    await RefreshTokenFactory.create({ user: { connect: { id: user2.id } } });
    await RefreshTokenFactory.create({ user: { connect: { id: user2.id } } });

    await clearTokenFamily(user2.id);

    const user2Tokens = await prisma().refreshToken.findMany({
      where: { userId: user2.id },
    });
    expect(user2Tokens).toHaveLength(0);

    const user1Tokens = await prisma().refreshToken.findMany({
      where: { userId: user1.id },
    });
    expect(user1Tokens).toHaveLength(2);
  });

  it('is idempotent', async () => {
    const { UserFactory, RefreshTokenFactory } = setup();
    const user = await UserFactory.create();

    await RefreshTokenFactory.create({ user: { connect: { id: user.id } } });
    await RefreshTokenFactory.create({ user: { connect: { id: user.id } } });

    await clearTokenFamily(user.id);
    await clearTokenFamily(user.id);
    await clearTokenFamily(user.id);

    const tokens = await prisma().refreshToken.findMany({
      where: { userId: user.id },
    });
    expect(tokens).toHaveLength(0);
  });
});
