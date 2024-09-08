import { apolloClient } from '@services/graphql/client';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createSSRApp, h, provide } from 'vue';
import App from './app/App.vue';
import { createVueRouter } from './app/create-vue-router';

export function createVueApp(opts: { isServer: boolean }) {
  const app = createSSRApp({
    setup: () => {
      provide(DefaultApolloClient, apolloClient);
    },
    render: () => h(App),
  });

  const router = createVueRouter(opts);
  app.use(router);

  return { app, router };
}
