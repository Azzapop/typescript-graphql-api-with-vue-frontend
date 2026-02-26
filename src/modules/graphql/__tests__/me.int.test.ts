import { cleanWorkerDatabase, createTestApp, loginAndGetCookies } from '#test';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '~database';
import { userProfileRepo, userRepo } from '~libs/repositories';

const ME_QUERY = '{ me { id email } }';

describe('POST /graphql - me query', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    const app = await createTestApp();

    const resp = await request(app).post('/graphql').send({ query: ME_QUERY });

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('returns NOT_FOUND_ERROR when user has no profile', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    await userRepo.createWithLocalCredentials({ username, password });

    const cookies = await loginAndGetCookies(app, username, password);

    const resp = await request(app)
      .post('/graphql')
      .set('Cookie', cookies)
      .send({ query: ME_QUERY });

    expect(resp.status).toBe(200);
    expect(resp.body.errors).toBeDefined();
    expect(resp.body.errors[0].extensions.code).toBe('NOT_FOUND_ERROR');
  });

  it('returns the user profile when it exists', async () => {
    const app = await createTestApp();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const createResult = await userRepo.createWithLocalCredentials({
      username,
      password,
    });
    if (!createResult.success) throw new Error('Failed to create user');
    const { data: createdUser } = createResult;

    const email = faker.internet.email();
    await prisma().userProfile.create({
      data: { userId: createdUser.id, email },
    });

    const cookies = await loginAndGetCookies(app, username, password);

    const resp = await request(app)
      .post('/graphql')
      .set('Cookie', cookies)
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

    const cookies = await loginAndGetCookies(app, username, password);

    vi.spyOn(userProfileRepo, 'getByUserId').mockRejectedValueOnce(
      new Error('DB connection lost')
    );

    const resp = await request(app)
      .post('/graphql')
      .set('Cookie', cookies)
      .send({ query: ME_QUERY });

    expect(resp.status).toBe(200);
    expect(resp.body.errors).toBeDefined();
    expect(resp.body.errors[0].extensions.code).toBe('INTERNAL_SERVER_ERROR');
  });
});
