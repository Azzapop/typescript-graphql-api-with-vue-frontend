import { cleanWorkerDatabase } from '#test/integration';
import {
  defineLocalCredentialsFactory,
  defineUserFactory,
} from '#test/factories/prisma';
import { beforeEach, describe, expect, it } from 'vitest';
import * as LocalCredentialsStore from '../index';

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

    const result = await LocalCredentialsStore.getWithUser(credentials.username);

    expect(result).not.toBeNull();
    expect(result).toMatchObject({
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

  it('returns null for non-existent username', async () => {
    const result = await LocalCredentialsStore.getWithUser('non-existent-user');

    expect(result).toBeNull();
  });

  it('returns null for empty string username', async () => {
    const result = await LocalCredentialsStore.getWithUser('');

    expect(result).toBeNull();
  });

  it('is case-sensitive', async () => {
    const { LocalCredentialsFactory } = setup();
    const credentials = await LocalCredentialsFactory.create({
      username: 'testuser',
    });

    const result = await LocalCredentialsStore.getWithUser('TestUser');

    expect(result).toBeNull();
    expect(credentials.username).toBe('testuser');
  });

  it('returns the correct credentials for each username when multiple exist', async () => {
    const { LocalCredentialsFactory } = setup();
    const creds1 = await LocalCredentialsFactory.create();
    const creds2 = await LocalCredentialsFactory.create();
    const creds3 = await LocalCredentialsFactory.create();

    const result1 = await LocalCredentialsStore.getWithUser(creds1.username);
    const result2 = await LocalCredentialsStore.getWithUser(creds2.username);
    const result3 = await LocalCredentialsStore.getWithUser(creds3.username);

    expect(result1?.user.id).toBe(creds1.userId);
    expect(result2?.user.id).toBe(creds2.userId);
    expect(result3?.user.id).toBe(creds3.userId);
  });
});
