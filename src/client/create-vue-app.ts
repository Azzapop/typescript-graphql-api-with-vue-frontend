import { createSSRApp } from 'vue';
import App from './app/App.vue';
import { createVueRouter } from './app/create-vue-router';

export function createVueApp(opts: { isServer: boolean }) {
  const app = createSSRApp(App);

  const router = createVueRouter(opts);
  app.use(router);

  return { app, router };
}
