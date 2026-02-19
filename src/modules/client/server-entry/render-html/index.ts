import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { Pinia } from 'pinia';
import { createPinia } from 'pinia';
import { renderToString } from 'vue/server-renderer';
import { createApolloClient, links } from '~libs/apollo-client';
import { createSchema } from '~modules/graphql';
import type { GraphQLContext } from '~modules/graphql/graphql-context';
import { createVueApp } from '../../app';
import { useAuthStore } from '../../app/stores/auth-store';
import { useGlobalErrorStore } from '../../app/stores/global-error-store';
import { renderPreloadLinks } from './render-preload-links';
import { renderStoreData } from './render-store-data';

// TODO consider using a dynamic import now that this is co-located with the schema
// If considering refactoring please note that 'schema' is passed in here to ensure that we do
// not include the entire schema (including resolvers) in the client build
const schema = createSchema();

const createApolloClientForRequest = (
  userId: string | null,
  store: Pinia
): ApolloClient<NormalizedCacheObject> => {
  // GraphQL requires authentication - context must have a user
  // Public routes should not make GraphQL queries
  // TODO split out the login frontend into it's own module to avoid this issue
  const context: GraphQLContext = {
    user: {
      id: userId!,
      // Note: These fields are not used in GraphQL resolvers, only id is needed
      tokenVersion: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  return createApolloClient({
    ssrMode: true,
    links: [
      links.createGraphQLErrorLink((errors, traceToken) => {
        if (errors.some((e) => e.code === 'INTERNAL_SERVER_ERROR')) {
          useGlobalErrorStore(store).setGlobalError(traceToken);
        }
      }),
      links.createSchemaLink(schema, context),
    ],
  });
};

export const renderHtml = async (opts: {
  template: string;
  url: string;
  manifest?: Record<string, string[]>;
  userId: string | null;
}) => {
  const { template, url, manifest, userId } = opts;

  // Create store first so it can be used by both Apollo client and Vue app
  const store = createPinia();

  const apolloClient = createApolloClientForRequest(userId, store);

  const { app, router } = createVueApp(
    { isServer: true },
    { apolloClient, store }
  );

  // Initialize auth store with user from server-side authentication
  const authStore = useAuthStore(store);
  authStore.setUser(userId);

  await router.push(url);
  await router.isReady();

  // Create and pass a SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on context.modules. After the render, context.modules would contain all the
  // components that have been instantiated during this render call.
  const context: { modules?: string[] } = {};

  // We need to render the app html itself first so that our modules and store are primed
  // for rendering
  let appHtml = await renderToString(app, context);

  // TODO: Remove this double-render workaround after implementing HTTP link for SSR
  // With HTTP link, errors will be processed synchronously during the HTTP request,
  // so globalError will be set before renderToString completes, eliminating the need
  // for this check and re-render. See docs/ssr-http-link-implementation-plan.md
  // Check if error was set during rendering (error link runs async after renderToString)
  // If so, we need to re-render with the error page to avoid hydration mismatch
  const globalErrorStore = useGlobalErrorStore(store);
  if (globalErrorStore.globalError) {
    // Re-render with error state
    appHtml = await renderToString(app, context);
  }

  let preloadLinks = '';
  if (context.modules && manifest) {
    preloadLinks = renderPreloadLinks(context.modules, manifest);
  }

  const appStore = renderStoreData(store.state.value);

  const html = template
    .replace(`<!--preload-links-->`, preloadLinks)
    .replace(`<!--app-store-->`, appStore)
    .replace(`<!--app-html-->`, appHtml!);

  return html;
};
