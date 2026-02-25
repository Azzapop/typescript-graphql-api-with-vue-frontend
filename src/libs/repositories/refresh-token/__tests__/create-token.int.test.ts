import { cleanWorkerDatabase } from '#test';
import { defineUserFactory } from '#test/factories';
import { faker } from '@faker-js/faker';
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

    const result = await createToken(user);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toMatchObject({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('creates multiple tokens with unique ids for the same user', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const result1 = await createToken(user);
    const result2 = await createToken(user);
    const result3 = await createToken(user);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result3.success).toBe(true);
    if (!result1.success || !result2.success || !result3.success) return;

    expect(result1.data.id).not.toBe(result2.data.id);
    expect(result2.data.id).not.toBe(result3.data.id);
    expect(result1.data.id).not.toBe(result3.data.id);
  });

  it('returns FOREIGN_KEY_CONSTRAINT when the user does not exist', async () => {
    const fakeUser = {
      id: faker.string.uuid(),
      tokenVersion: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await createToken(fakeUser);

    expect(result).toEqual({ success: false, error: 'FOREIGN_KEY_CONSTRAINT' });
  });
});
