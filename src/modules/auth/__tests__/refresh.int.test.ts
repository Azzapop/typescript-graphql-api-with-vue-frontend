import { cleanWorkerDatabase, createTestApp } from '#test';
import { faker } from '@faker-js/faker';
import type { Express } from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as authTokens from '~libs/auth-tokens';
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

describe('POST /auth/refresh', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 200 with user id and sets new auth cookies', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({
      username,
      password,
    });
    if (!createResult.success) throw new Error('Failed to create user');

    const loginCookies = await loginAndGetCookies(app, username, password);

    const resp = await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ user: { id: createResult.data.id } });

    // eslint-disable-next-line prefer-destructuring
  const cookies = resp.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const cookieStr = Array.isArray(cookies) ? cookies.join('; ') : cookies;
    expect(cookieStr).toMatch(/access_token=.+/);
    expect(cookieStr).toMatch(/refresh_token=.+/);
  });

  it('returns 401 when no refresh token cookie is present', async () => {
    const app = await createTestApp();

    const resp = await request(app).post('/auth/refresh');

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 401 when refresh token is invalid', async () => {
    const app = await createTestApp();

    const resp = await request(app)
      .post('/auth/refresh')
      .set('Cookie', ['refresh_token=garbage-token-value']);

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 401 when using a previously consumed refresh token (replay attack)', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const loginCookies = await loginAndGetCookies(app, username, password);

    // First refresh — consumes the original token and issues a new one
    const firstRefresh = await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);
    expect(firstRefresh.status).toBe(200);

    // Second refresh with the same (now old) cookies — should be rejected
    const replayAttempt = await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    expect(replayAttempt.status).toBe(401);
    expect(replayAttempt.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('clears token family on replay attack detection', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const loginCookies = await loginAndGetCookies(app, username, password);

    // Refresh to get new cookies
    const firstRefresh = await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);
    expect(firstRefresh.status).toBe(200);
    // eslint-disable-next-line prefer-destructuring
    const newCookies = firstRefresh.headers['set-cookie'];

    // Replay attack with old cookies — triggers family clear
    await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    // Even the new cookies should now be invalid (family was cleared)
    const afterClear = await request(app)
      .post('/auth/refresh')
      .set('Cookie', Array.isArray(newCookies) ? newCookies : []);

    expect(afterClear.status).toBe(401);
    expect(afterClear.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 500 when token issuance throws in middleware', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const loginCookies = await loginAndGetCookies(app, username, password);

    vi.spyOn(authTokens, 'issueTokens').mockRejectedValueOnce(
      new Error('Token signing failure')
    );

    const resp = await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    expect(resp.status).toBe(500);
    expect(resp.body).toMatchObject({
      code: 'INTERNAL_ERROR',
      message: expect.any(String),
    });
  });
});
