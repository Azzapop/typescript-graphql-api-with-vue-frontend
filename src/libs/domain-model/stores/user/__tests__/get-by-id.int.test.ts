import { cleanWorkerDatabase } from '#test/integration';
import {
  defineUserFactory,
} from '#test/factories/prisma';
import { beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../index';

const setup = () => ({
  UserFactory: defineUserFactory(),
});

describe('UserStore.getById (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('returns the user when it exists', async () => {
    const { UserFactory } = setup();
    const created = await UserFactory.create();

    const user = await UserStore.getById(created.id);

    expect(user).toMatchObject({
      id: created.id,
      tokenVersion: created.tokenVersion,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('returns null for a non-existent id', async () => {
    const user = await UserStore.getById('non-existent-id');

    expect(user).toBeNull();
  });

  it('returns null for empty string id', async () => {
    const user = await UserStore.getById('');

    expect(user).toBeNull();
  });

  it('returns the correct user when multiple users exist', async () => {
    const { UserFactory } = setup();
    const user1 = await UserFactory.create();
    const user2 = await UserFactory.create();
    const user3 = await UserFactory.create();

    const result1 = await UserStore.getById(user1.id);
    const result2 = await UserStore.getById(user2.id);
    const result3 = await UserStore.getById(user3.id);

    expect(result1?.id).toBe(user1.id);
    expect(result2?.id).toBe(user2.id);
    expect(result3?.id).toBe(user3.id);
  });
});
