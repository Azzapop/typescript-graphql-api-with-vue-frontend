import { createSSRApp } from 'vue';
import App from './App.vue';
import { createVueRouter } from './router';

export function createVueApp(opts: { isServer: boolean }) {
  const router = createVueRouter(opts);
  const app = createSSRApp(App);
  app.use(router);

  return { app, router };
}
