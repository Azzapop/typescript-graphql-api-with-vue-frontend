import type { Express } from 'express';
import request from 'supertest';

export const loginAndGetCookies = async (
  app: Express,
  username: string,
  password: string
): Promise<string[]> => {
  const resp = await request(app)
    .post('/auth/login/local')
    .send({ username, password });

  if (resp.status !== 200) throw new Error('Login failed');

  // eslint-disable-next-line prefer-destructuring
  const cookies = resp.headers['set-cookie'];
  return Array.isArray(cookies) ? cookies : [];
};
