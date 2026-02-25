import { cleanWorkerDatabase, createTestApp } from '#test';
import {
  defineLocalCredentialsFactory,
  defineUserFactory,
} from '#test/factories';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

const setup = async () => ({
  app: await createTestApp(),
  LocalCredentialsFactory: defineLocalCredentialsFactory({
    defaultData: { user: defineUserFactory() },
  }),
});

describe('Auth Module - login', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('logs a user in given the correct username and password', async () => {
    const { app, LocalCredentialsFactory } = await setup();

    const localCredentials = await LocalCredentialsFactory.create();

    const resp = request(app)
      .post('login/local')
      .send({ username: localCredentials.username, password: localCredentials. });
  });
});
