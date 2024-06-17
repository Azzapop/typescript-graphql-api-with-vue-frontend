import { Router } from 'express';
import { get } from './example/get';
import { post } from './example/post';

export const injectRoutes = (router: Router): Router => {
  router.get('/get', get);
  router.post('/post', post);

  return router;
};
