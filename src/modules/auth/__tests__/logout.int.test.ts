import { cleanWorkerDatabase, createTestApp } from '#test';
import { faker } from '@faker-js/faker';
import type { Express } from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userRepo } from '~libs/repositories';

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

  it('invalidates refresh token after logout', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const cookies = await loginAndGetCookies(app, username, password);

    // Logout
    const logoutResp = await request(app)
      .delete('/auth/logout')
      .set('Cookie', cookies);
    expect(logoutResp.status).toBe(200);

    // Attempt refresh with old cookies
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
