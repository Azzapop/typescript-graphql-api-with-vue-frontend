import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import Aura from '@primevue/themes/aura';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { createSSRApp, h, provide } from 'vue';
import { createApolloClient } from '~modules/graphql/create-apollo-client';
import App from './App.vue';
import './assets/styles/index.scss';
import { createVueRouter } from './create-vue-router';
import { createAppI18n } from './i18n/create-app-i18n';

export const createVueApp = (
  opts: { isServer: boolean },
  deps: { apolloClient?: ApolloClient<NormalizedCacheObject> } = {}
) => {
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
      // TODO Can we avoid having to set the theme here due to the AppConfigurator?
      preset: Aura,
      options: {
        // TODO Tie this into the layout so there's no need to remember to change it everywhere
        darkModeSelector: '.app-dark',
      },
    },
  });

  const i18n = createAppI18n();
  app.use(i18n);

  return { app, router, store, i18n };
};
