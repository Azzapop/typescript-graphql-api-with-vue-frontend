import { cleanWorkerDatabase, createTestApp } from '#test';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { localCredentialsRepo, userRepo } from '~libs/repositories';

describe('POST /auth/login/local', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 200 with user id and sets auth cookies on valid credentials', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({
      username,
      password,
    });
    if (!createResult.success) throw new Error('Failed to create user');

    const resp = await request(app)
      .post('/auth/login/local')
      .type('form')
      .send({ username, password });

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ user: { id: createResult.data.id } });

    // eslint-disable-next-line prefer-destructuring
    const cookies = resp.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const cookieStr = Array.isArray(cookies) ? cookies.join('; ') : cookies;
    expect(cookieStr).toMatch(/access_token=.+/);
    expect(cookieStr).toMatch(/refresh_token=.+/);
    expect(cookieStr).toMatch(/HttpOnly/i);
  });

  it('returns 401 when password is wrong', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    await userRepo.createWithLocalCredentials({
      username,
      password: faker.internet.password(),
    });

    const resp = await request(app)
      .post('/auth/login/local')
      .type('form')
      .send({ username, password: 'wrong-password' });

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 401 when username does not exist', async () => {
    const app = await createTestApp();

    const resp = await request(app)
      .post('/auth/login/local')
      .type('form')
      .send({
        username: 'nonexistent-user',
        password: faker.internet.password(),
      });

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 401 when username is missing', async () => {
    const app = await createTestApp();

    const resp = await request(app)
      .post('/auth/login/local')
      .type('form')
      .send({ password: faker.internet.password() });

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 401 when password is missing', async () => {
    const app = await createTestApp();

    const resp = await request(app)
      .post('/auth/login/local')
      .type('form')
      .send({ username: faker.internet.userName() });

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 401 when body is empty', async () => {
    const app = await createTestApp();

    const resp = await request(app)
      .post('/auth/login/local')
      .type('form')
      .send({});

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      code: 'UNAUTHORIZED',
      message: expect.any(String),
    });
  });

  it('returns 500 when credential lookup throws', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    vi.spyOn(localCredentialsRepo, 'getWithUser').mockRejectedValueOnce(
      new Error('DB connection lost')
    );

    const resp = await request(app)
      .post('/auth/login/local')
      .type('form')
      .send({ username, password });

    expect(resp.status).toBe(500);
    expect(resp.body).toMatchObject({
      code: 'INTERNAL_ERROR',
      message: expect.any(String),
    });
  });
});
