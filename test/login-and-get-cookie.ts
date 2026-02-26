import type { Express } from 'express';
import request from 'supertest';

export const loginAndGetCookie = async (
  app: Express,
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
