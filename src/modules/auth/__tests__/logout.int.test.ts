import { cleanWorkerDatabase, createTestApp } from '#test';
import { faker } from '@faker-js/faker';
import type { Express } from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { refreshTokenRepo, userRepo } from '~libs/repositories';

const loginAndGetCookies = async (
  app: Express,
  username: string,
  password: string
): Promise<string[]> => {
  const resp = await request(app)
    .post('/auth/login/local')
    .type('form')
    .send({ username, password });

  expect(resp.status).toBe(200);
  // eslint-disable-next-line prefer-destructuring
  const cookies = resp.headers['set-cookie'];
  return Array.isArray(cookies) ? cookies : [];
};

describe('DELETE /auth/logout', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 200 with { success: true } when refresh token is valid', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const cookies = await loginAndGetCookies(app, username, password);

    const resp = await request(app)
      .delete('/auth/logout')
      .set('Cookie', cookies);

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ success: true });
  });

  it('rotates the token version in the database on logout', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({ username, password });
    if (!createResult.success) throw new Error('Failed to create user');
    const { data: createdUser } = createResult;
    const { id: userId, tokenVersion: originalTokenVersion } = createdUser;

    const cookies = await loginAndGetCookies(app, username, password);

    await request(app)
      .delete('/auth/logout')
      .set('Cookie', cookies);

    const userResult = await userRepo.getById(userId);
    expect(userResult.success).toBe(true);
    if (!userResult.success) throw new Error('Unexpected result shape');
    expect(userResult.data?.tokenVersion).not.toBe(originalTokenVersion);
  });

  it('clears the refresh token family from the database on logout', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({ username, password });
    if (!createResult.success) throw new Error('Failed to create user');
    const { data: createdUser } = createResult;
    const { id: userId } = createdUser;

    const cookies = await loginAndGetCookies(app, username, password);

    // Confirm a token exists in the DB before logout
    const beforeLogout = await refreshTokenRepo.findYoungest(userId);
    expect(beforeLogout.success).toBe(true);
    if (!beforeLogout.success) throw new Error('Unexpected result shape');
    expect(beforeLogout.data).not.toBeNull();

    await request(app)
      .delete('/auth/logout')
      .set('Cookie', cookies);

    // Token family should now be empty
    const afterLogout = await refreshTokenRepo.findYoungest(userId);
    expect(afterLogout.success).toBe(true);
    if (!afterLogout.success) throw new Error('Unexpected result shape');
    expect(afterLogout.data).toBeNull();
  });

  it('invalidates refresh token after logout', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const cookies = await loginAndGetCookies(app, username, password);

    const logoutResp = await request(app)
      .delete('/auth/logout')
      .set('Cookie', cookies);
    expect(logoutResp.status).toBe(200);

    // Attempt refresh with old cookies — should fail because token version changed
    const refreshResp = await request(app)
      .post('/auth/refresh')
      .set('Cookie', cookies);

    expect(refreshResp.status).toBe(401);
    expect(refreshResp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 401 when no refresh token cookie is present', async () => {
    const app = await createTestApp();

    const resp = await request(app).delete('/auth/logout');

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 500 when token rotation throws', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const cookies = await loginAndGetCookies(app, username, password);

    vi.spyOn(userRepo, 'rotateTokenVersion').mockRejectedValueOnce(
      new Error('DB connection lost')
    );

    const resp = await request(app)
      .delete('/auth/logout')
      .set('Cookie', cookies);

    expect(resp.status).toBe(500);
    expect(resp.body).toMatchObject({
      code: 'INTERNAL_ERROR',
      message: expect.any(String),
    });
  });
});
