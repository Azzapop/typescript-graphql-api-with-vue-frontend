import { cleanWorkerDatabase } from '#test/integration';
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import * as UserStore from '../index';

const prisma = new PrismaClient();

const setup = () => ({});

describe('UserStore.createWithLocalCredentials (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates user and local credentials', async () => {
    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toMatchObject({
      id: expect.any(String),
      tokenVersion: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    const user = await prisma.user.findUnique({ where: { id: result.data.id } });
    expect(user).not.toBeNull();

    const credentials = await prisma.localCredentials.findUnique({
      where: { userId: result.data.id },
    });
    expect(credentials).toMatchObject({
      username: 'testuser',
      hashedPassword: expect.any(String),
    });
  });

  it('hashes the password', async () => {
    const password = 'my-secret-password';

    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      password,
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    const credentials = await prisma.localCredentials.findUnique({
      where: { userId: result.data.id },
    });

    expect(credentials?.hashedPassword).not.toBe(password);
    expect(credentials?.hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
  });

  it('returns { success: false, error: "USERNAME_EXISTS" } on duplicate username', async () => {
    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      password: 'password123',
    });

    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      password: 'differentpassword',
    });

    expect(result).toEqual({ success: false, error: 'USERNAME_EXISTS' });
  });

  it('rolls back the transaction when credentials fail', async () => {
    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      password: 'password123',
    });

    const userCountBefore = await prisma.user.count();

    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      password: 'differentpassword',
    });

    expect(result.success).toBe(false);

    const userCountAfter = await prisma.user.count();
    expect(userCountAfter).toBe(userCountBefore);
  });

  it('treats usernames as case-sensitive', async () => {
    const result1 = await UserStore.createWithLocalCredentials({
      username: 'TestUser',
      password: 'pass1',
    });

    const result2 = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      password: 'pass2',
    });

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
  });
});
