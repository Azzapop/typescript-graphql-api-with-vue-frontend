import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '@modules/graphql/create-apollo-client';
import Aura from '@primevue/themes/aura';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { createSSRApp, h, provide } from 'vue';
import App from './App.vue';
import './assets/styles.scss';
import './assets/tailwind.css';
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

  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.app-dark',
      }
    },
  });

  return { app, router, store };
}
