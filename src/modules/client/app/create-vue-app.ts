import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '@modules/graphql/create-apollo-client';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createPinia } from 'pinia';
import { createSSRApp, h, provide } from 'vue';
import App from './App.vue';
import { createVueRouter } from './create-vue-router';

export function createVueApp(
  opts: { isServer: boolean },
  deps: { apolloClient?: ApolloClient<NormalizedCacheObject> } = {}
) {
  const { apolloClient = createApolloClient(opts) } = deps;

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
