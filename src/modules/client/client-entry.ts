import { createPinia } from 'pinia';
import { createApolloClient, links } from '~libs/apollo-client';
import { createVueApp } from './app';
import { useGlobalErrorStore } from './app/stores/global-error-store';

const apolloClient = createApolloClient({
  links: [
    links.createGraphQLErrorLink((errors, traceToken) => {
      if (errors.some((e) => e.code === 'INTERNAL_SERVER_ERROR')) {
        useGlobalErrorStore().setGlobalError(traceToken);
      }
    }),
    links.createNetworkErrorLink((_error, traceToken) => {
      useGlobalErrorStore().setGlobalError(traceToken);
    }),
    links.createHttpLink('/graphql'),
  ],
});

const store = createPinia();
if (window.__app_store) {
  store.state.value = JSON.parse(window.__app_store);
}

const { app, router } = createVueApp(
  { isServer: false },
  { apolloClient, store }
);

await router.isReady();

app.mount('#app');
