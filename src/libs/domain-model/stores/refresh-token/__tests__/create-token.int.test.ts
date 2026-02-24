import { cleanWorkerDatabase } from '#test/integration';
import { defineUserFactory } from '#test/factories/prisma';
import { beforeEach, describe, expect, it } from 'vitest';
import * as RefreshTokenStore from '../index';

const setup = () => ({
  UserFactory: defineUserFactory(),
});

describe('RefreshTokenStore.createToken (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('creates a token with the correct shape', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const token = await RefreshTokenStore.createToken(user);

    expect(token).toMatchObject({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('creates multiple tokens with unique ids for the same user', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const token1 = await RefreshTokenStore.createToken(user);
    const token2 = await RefreshTokenStore.createToken(user);
    const token3 = await RefreshTokenStore.createToken(user);

    expect(token1.id).not.toBe(token2.id);
    expect(token2.id).not.toBe(token3.id);
    expect(token1.id).not.toBe(token3.id);
  });

  it('throws when the user does not exist', async () => {
    const fakeUser = {
      id: 'non-existent-user-id',
      tokenVersion: 'fake-version',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await expect(RefreshTokenStore.createToken(fakeUser)).rejects.toThrow();
  });
});
