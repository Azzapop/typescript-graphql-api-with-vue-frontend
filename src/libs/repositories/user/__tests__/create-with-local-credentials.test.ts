import { cleanWorkerDatabase } from '#test';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '~database';
import { createWithLocalCredentials } from '../create-with-local-credentials';

describe('createWithLocalCredentials', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('creates user and local credentials', async () => {
    const username = faker.internet.userName();
    const password = faker.internet.password();

    const result = await createWithLocalCredentials({ username, password });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toMatchObject({
      id: expect.any(String),
      tokenVersion: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    const user = await prisma().user.findUnique({
      where: { id: result.data.id },
    });
    expect(user).not.toBeNull();

    const credentials = await prisma().localCredentials.findUnique({
      where: { userId: result.data.id },
    });
    expect(credentials).toMatchObject({
      username,
      hashedPassword: expect.any(String),
    });
  });

  it('hashes the password', async () => {
    const password = faker.internet.password();

    const result = await createWithLocalCredentials({
      username: faker.internet.userName(),
      password,
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    const credentials = await prisma().localCredentials.findUnique({
      where: { userId: result.data.id },
    });

    expect(credentials?.hashedPassword).not.toBe(password);
    // Matches bcrypt hash format: $2a$, $2b$, or $2y$ followed by cost factor
    expect(credentials?.hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
  });

  it('returns { success: false, error: "UNIQUE_CONSTRAINT" } on duplicate username', async () => {
    const username = faker.internet.userName();

    await createWithLocalCredentials({
      username,
      password: faker.internet.password(),
    });

    const result = await createWithLocalCredentials({
      username,
      password: faker.internet.password(),
    });

    expect(result).toEqual({ success: false, error: 'UNIQUE_CONSTRAINT' });
  });

  it('rolls back the transaction when credentials fail', async () => {
    const username = faker.internet.userName();

    await createWithLocalCredentials({
      username,
      password: faker.internet.password(),
    });

    const userCountBefore = await prisma().user.count();

    const result = await createWithLocalCredentials({
      username,
      password: faker.internet.password(),
    });

    expect(result.success).toBe(false);

    const userCountAfter = await prisma().user.count();
    expect(userCountAfter).toBe(userCountBefore);
  });

  it('treats usernames as case-sensitive', async () => {
    const username = faker.internet.userName();

    const result1 = await createWithLocalCredentials({
      username: username.toUpperCase(),
      password: faker.internet.password(),
    });

    const result2 = await createWithLocalCredentials({
      username: username.toLowerCase(),
      password: faker.internet.password(),
    });

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
  });
});
