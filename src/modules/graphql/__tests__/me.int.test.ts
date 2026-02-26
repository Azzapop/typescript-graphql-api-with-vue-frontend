import { cleanWorkerDatabase, createTestApp } from '#test';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '~database';
import { userProfileRepo, userRepo } from '~libs/repositories';

const ME_QUERY = '{ me { id email } }';

const loginAndGetCookie = async (
  app: Awaited<ReturnType<typeof createTestApp>>,
  username: string,
  password: string
): Promise<string> => {
  const resp = await request(app)
    .post('/auth/login/local')
    .send({ username, password });

  if (resp.status !== 200) throw new Error('Login failed');

  // eslint-disable-next-line prefer-destructuring
  const cookies = resp.headers['set-cookie'];
  const cookieStr = Array.isArray(cookies) ? cookies.join('; ') : cookies;
  const match = /access_token=([^;]+)/.exec(cookieStr);
  if (!match) throw new Error('No access_token cookie in login response');
  return `access_token=${match[1]}`;
};

describe('POST /graphql - me query', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    const app = await createTestApp();

    const resp = await request(app)
      .post('/graphql')
      .send({ query: ME_QUERY });

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('returns NOT_FOUND_ERROR when user has no profile', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const cookie = await loginAndGetCookie(app, username, password);

    const resp = await request(app)
      .post('/graphql')
      .set('Cookie', cookie)
      .send({ query: ME_QUERY });

    expect(resp.status).toBe(200);
    expect(resp.body.errors).toBeDefined();
    expect(resp.body.errors[0].extensions.code).toBe('NOT_FOUND_ERROR');
  });

  it('returns the user profile when it exists', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({ username, password });
    if (!createResult.success) throw new Error('Failed to create user');
    const { data: createdUser } = createResult;

    const email = faker.internet.email();
    await prisma().userProfile.create({ data: { userId: createdUser.id, email } });

    const cookie = await loginAndGetCookie(app, username, password);

    const resp = await request(app)
      .post('/graphql')
      .set('Cookie', cookie)
      .send({ query: ME_QUERY });

    expect(resp.status).toBe(200);
    expect(resp.body.errors).toBeUndefined();
    expect(resp.body.data.me).toEqual({ id: expect.any(String), email });
  });

  it('returns INTERNAL_SERVER_ERROR when the profile repository throws', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const cookie = await loginAndGetCookie(app, username, password);

    vi.spyOn(userProfileRepo, 'getByUserId').mockRejectedValueOnce(
      new Error('DB connection lost')
    );

    const resp = await request(app)
      .post('/graphql')
      .set('Cookie', cookie)
      .send({ query: ME_QUERY });

    expect(resp.status).toBe(200);
    expect(resp.body.errors).toBeDefined();
    expect(resp.body.errors[0].extensions.code).toBe('INTERNAL_SERVER_ERROR');
  });

  it('persists the user profile record visible via the repository', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({ username, password });
    if (!createResult.success) throw new Error('Failed to create user');
    const { data: createdUser } = createResult;

    const email = faker.internet.email();
    await prisma().userProfile.create({ data: { userId: createdUser.id, email } });

    const profileResult = await userProfileRepo.getByUserId(createdUser.id);
    expect(profileResult.success).toBe(true);
    if (!profileResult.success) throw new Error('Unexpected result shape');
    expect(profileResult.data).not.toBeNull();
    expect(profileResult.data?.email).toBe(email);
  });
});
