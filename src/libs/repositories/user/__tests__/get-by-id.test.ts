import { cleanWorkerDatabase } from '#test';
import { defineUserFactory } from '#test/factories';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { getById } from '../get-by-id';

const setup = () => ({
  UserFactory: defineUserFactory(),
});

describe('getById', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('returns the user when it exists', async () => {
    const { UserFactory } = setup();
    const created = await UserFactory.create();

    const result = await getById(created.id);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toMatchObject({
      id: created.id,
      tokenVersion: created.tokenVersion,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('returns success with null for a non-existent id', async () => {
    const result = await getById(faker.string.uuid());

    expect(result).toEqual({ success: true, data: null });
  });

  it('returns success with null for empty string id', async () => {
    const result = await getById('');

    expect(result).toEqual({ success: true, data: null });
  });

  it('returns the correct user when multiple users exist', async () => {
    const { UserFactory } = setup();
    const user1 = await UserFactory.create();
    const user2 = await UserFactory.create();
    const user3 = await UserFactory.create();

    const result1 = await getById(user1.id);
    const result2 = await getById(user2.id);
    const result3 = await getById(user3.id);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result3.success).toBe(true);
    if (!result1.success || !result2.success || !result3.success) return;

    expect(result1.data?.id).toBe(user1.id);
    expect(result2.data?.id).toBe(user2.id);
    expect(result3.data?.id).toBe(user3.id);
  });
});
