import type {
  ApolloClientOptions,
  NormalizedCacheObject,
} from '@apollo/client/core';
import {
  ApolloClient,
  InMemoryCache,
  from as linkFrom,
} from '@apollo/client/core';
import type { ClientLink } from './apollo-client-types';

const createConfig = (opts: {
  links: ClientLink[];
  ssrMode?: boolean;
}): ApolloClientOptions<NormalizedCacheObject> => ({
  ssrMode: opts.ssrMode ?? false,
  cache: new InMemoryCache(),
  link: linkFrom(opts.links),
  defaultOptions: {
    query: {
      // TODO: Update to use 'none' for both SSR and client after implementing HTTP link for SSR
      // Current issue: errorPolicy 'none' with SchemaLink throws async errors after renderToString
      // Solution: Replace SchemaLink with HttpLink for SSR (see docs/ssr-http-link-implementation-plan.md)
      // After fix: errorPolicy: 'none' for both (consistent behavior, no partial data)
      // Temporary: SSR uses 'all' to prevent crashes, client uses 'none'
      errorPolicy: opts.ssrMode ? 'all' : 'none',
    },
    watchQuery: {
      errorPolicy: opts.ssrMode ? 'all' : 'none',
    },
  },
});

export const createApolloClient = (opts: {
  links: ClientLink[];
  ssrMode?: boolean;
}): ApolloClient<NormalizedCacheObject> => new ApolloClient(createConfig(opts));
