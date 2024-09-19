import { createApolloClient } from '@services/graphql/client';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createPinia } from 'pinia';
import { createSSRApp, h, provide } from 'vue';
import App from './app/App.vue';
import { createVueRouter } from './app/create-vue-router';

export function createVueApp(opts: { isServer: boolean }) {
  const apolloClient = createApolloClient(opts);

  const app = createSSRApp({
    setup: () => {
      provide(DefaultApolloClient, apolloClient);
    },
    render: () => h(App),
  });

  const router = createVueRouter(opts);
  app.use(router);

  const store = createPinia();
  app.use(store);

  return { app, router, store };
}
