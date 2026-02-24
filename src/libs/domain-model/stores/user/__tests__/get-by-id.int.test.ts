import { defineUserFactory } from '#test/factories';
import { cleanWorkerDatabase } from '#test/integration';
import { beforeEach, describe, expect, it } from 'vitest';
import { getById } from '../get-by-id';

const setup = () => ({
  UserFactory: defineUserFactory(),
});

describe('getById (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('returns the user when it exists', async () => {
    const { UserFactory } = setup();
    const created = await UserFactory.create();

    const user = await getById(created.id);

    expect(user).toMatchObject({
      id: created.id,
      tokenVersion: created.tokenVersion,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('returns null for a non-existent id', async () => {
    const user = await getById('non-existent-id');

    expect(user).toBeNull();
  });

  it('returns null for empty string id', async () => {
    const user = await getById('');

    expect(user).toBeNull();
  });

  it('returns the correct user when multiple users exist', async () => {
    const { UserFactory } = setup();
    const user1 = await UserFactory.create();
    const user2 = await UserFactory.create();
    const user3 = await UserFactory.create();

    const result1 = await getById(user1.id);
    const result2 = await getById(user2.id);
    const result3 = await getById(user3.id);

    expect(result1?.id).toBe(user1.id);
    expect(result2?.id).toBe(user2.id);
    expect(result3?.id).toBe(user3.id);
  });
});
