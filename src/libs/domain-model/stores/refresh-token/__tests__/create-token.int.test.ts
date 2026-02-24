import { defineUserFactory } from '#test/factories';
import { cleanWorkerDatabase } from '#test/integration';
import { beforeEach, describe, expect, it } from 'vitest';
import { createToken } from '../create-token';

const setup = () => ({
  UserFactory: defineUserFactory(),
});

describe('createToken (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('creates a token with the correct shape', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const token = await createToken(user);

    expect(token).toMatchObject({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('creates multiple tokens with unique ids for the same user', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const token1 = await createToken(user);
    const token2 = await createToken(user);
    const token3 = await createToken(user);

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

    await expect(createToken(fakeUser)).rejects.toThrow();
  });
});
