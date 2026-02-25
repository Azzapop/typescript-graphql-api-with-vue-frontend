import { cleanWorkerDatabase } from '#test';
import {
  defineLocalCredentialsFactory,
  defineUserFactory,
} from '#test/factories';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { getWithUser } from '../get-with-user';

const setup = () => ({
  LocalCredentialsFactory: defineLocalCredentialsFactory({
    defaultData: { user: defineUserFactory() },
  }),
});

describe('LocalCredentialsStore.getWithUser (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('returns credentials with embedded user data', async () => {
    const { LocalCredentialsFactory } = setup();
    const credentials = await LocalCredentialsFactory.create();

    const result = await getWithUser(credentials.username);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toMatchObject({
      id: expect.any(String),
      userId: credentials.userId,
      username: credentials.username,
      hashedPassword: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      user: {
        id: credentials.userId,
        tokenVersion: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });

  it('returns success with null for non-existent username', async () => {
    const result = await getWithUser(faker.internet.userName());

    expect(result).toEqual({ success: true, data: null });
  });

  it('returns success with null for empty string username', async () => {
    const result = await getWithUser('');

    expect(result).toEqual({ success: true, data: null });
  });

  it('is case-sensitive', async () => {
    const { LocalCredentialsFactory } = setup();
    const username = faker.internet.userName().toLowerCase();
    const credentials = await LocalCredentialsFactory.create({ username });

    const result = await getWithUser(username.toUpperCase());

    expect(result).toEqual({ success: true, data: null });
    expect(credentials.username).toBe(username);
  });

  it('returns the correct credentials for each username when multiple exist', async () => {
    const { LocalCredentialsFactory } = setup();
    const creds1 = await LocalCredentialsFactory.create();
    const creds2 = await LocalCredentialsFactory.create();
    const creds3 = await LocalCredentialsFactory.create();

    const result1 = await getWithUser(creds1.username);
    const result2 = await getWithUser(creds2.username);
    const result3 = await getWithUser(creds3.username);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result3.success).toBe(true);
    if (!result1.success || !result2.success || !result3.success) return;

    expect(result1.data?.user.id).toBe(creds1.userId);
    expect(result2.data?.user.id).toBe(creds2.userId);
    expect(result3.data?.user.id).toBe(creds3.userId);
  });
});
