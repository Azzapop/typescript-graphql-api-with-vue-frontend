import { cleanWorkerDatabase, createTestApp, tick } from '#test';
import { faker } from '@faker-js/faker';
import type { Express } from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as authTokens from '~libs/auth-tokens';
import { refreshTokenRepo, userRepo } from '~libs/repositories';

const extractCookieValue = (cookies: string[], name: string): string | undefined => {
  const match = cookies.find((c) => c.startsWith(`${name}=`));
  return match?.split(';')[0]?.slice(name.length + 1);
};

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
    const { data: createdUser } = createResult;

    const loginCookies = await loginAndGetCookies(app, username, password);

    const resp = await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ user: { id: createdUser.id } });

    // eslint-disable-next-line prefer-destructuring
    const cookies = resp.headers['set-cookie'];
    expect(Array.isArray(cookies)).toBe(true);
    const cookieArr = Array.isArray(cookies) ? cookies : [];
    expect(extractCookieValue(cookieArr, 'access_token')).toBeTruthy();
    expect(extractCookieValue(cookieArr, 'refresh_token')).toBeTruthy();
  });

  it('replaces the refresh token record in the database on successful refresh', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({ username, password });
    if (!createResult.success) throw new Error('Failed to create user');
    const { data: createdUser } = createResult;

    const loginCookies = await loginAndGetCookies(app, username, password);

    const tokenAfterLogin = await refreshTokenRepo.findYoungest(createdUser.id);
    expect(tokenAfterLogin.success).toBe(true);
    if (!tokenAfterLogin.success) throw new Error('Unexpected result shape');
    expect(tokenAfterLogin.data).not.toBeNull();
    const loginTokenId = tokenAfterLogin.data?.id;

    await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    const tokenAfterRefresh = await refreshTokenRepo.findYoungest(createdUser.id);
    expect(tokenAfterRefresh.success).toBe(true);
    if (!tokenAfterRefresh.success) throw new Error('Unexpected result shape');
    expect(tokenAfterRefresh.data).not.toBeNull();
    // A new record was created — the old one is no longer the youngest
    expect(tokenAfterRefresh.data?.id).not.toBe(loginTokenId);
  });

  it('issues tokens that are different from the ones issued at login', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    vi.useFakeTimers();
    const loginCookies = await loginAndGetCookies(app, username, password);
    const originalAccessToken = extractCookieValue(loginCookies, 'access_token');
    const originalRefreshToken = extractCookieValue(loginCookies, 'refresh_token');

    // Advance 1 second so the access token exp claim differs
    tick(1000);

    const resp = await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    vi.useRealTimers();

    expect(resp.status).toBe(200);
    // eslint-disable-next-line prefer-destructuring
    const newCookieHeaders = resp.headers['set-cookie'];
    const newCookies = Array.isArray(newCookieHeaders) ? newCookieHeaders : [];
    const newAccessToken = extractCookieValue(newCookies, 'access_token');
    const newRefreshToken = extractCookieValue(newCookies, 'refresh_token');

    expect(newAccessToken).toBeTruthy();
    expect(newRefreshToken).toBeTruthy();
    // Access token exp differs because time advanced; refresh token encodes a unique DB record ID
    expect(newAccessToken).not.toBe(originalAccessToken);
    expect(newRefreshToken).not.toBe(originalRefreshToken);
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

  it('deletes the token family from the database on replay attack detection', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({ username, password });
    if (!createResult.success) throw new Error('Failed to create user');
    const { data: createdUser } = createResult;
    const { id: userId } = createdUser;

    const loginCookies = await loginAndGetCookies(app, username, password);

    // Refresh once — now there is one token in the family
    const firstRefresh = await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);
    expect(firstRefresh.status).toBe(200);

    // Confirm a token exists in the DB before the replay
    const beforeReplay = await refreshTokenRepo.findYoungest(userId);
    expect(beforeReplay.success).toBe(true);
    if (!beforeReplay.success) throw new Error('Unexpected result shape');
    expect(beforeReplay.data).not.toBeNull();

    // Replay attack with the original login cookies — triggers family clear
    await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    // Token family should now be empty in the database
    const afterReplay = await refreshTokenRepo.findYoungest(userId);
    expect(afterReplay.success).toBe(true);
    if (!afterReplay.success) throw new Error('Unexpected result shape');
    expect(afterReplay.data).toBeNull();
  });

  it('invalidates new cookies after replay attack clears the token family', async () => {
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
    const newCookieHeaders = firstRefresh.headers['set-cookie'];
    const newCookies = Array.isArray(newCookieHeaders) ? newCookieHeaders : [];

    // Replay attack with old cookies — triggers family clear
    await request(app)
      .post('/auth/refresh')
      .set('Cookie', loginCookies);

    // Even the new cookies should now be invalid (family was cleared)
    const afterClear = await request(app)
      .post('/auth/refresh')
      .set('Cookie', newCookies);

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
