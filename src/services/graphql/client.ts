import { SchemaLink } from '@apollo/client/link/schema';
import { ApolloClient, InMemoryCache, ApolloClientOptions, NormalizedCacheObject } from '@apollo/client/core';
import { schema } from '../../graphql/server';

type Config = ApolloClientOptions<NormalizedCacheObject>

const clientConfig = (): Config => {
  return {
    cache: new InMemoryCache(),
    uri: '/graphql',
  }
}

// TODO dynamic import schema function so that we're not importing the entire server for the client
const serverConfig = (): Config => {
  return {
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema })
  }
}

const apolloClientConfig = (opts: { isServer: boolean }): Config => {
  const { isServer } = opts;

  return isServer ? serverConfig() : clientConfig();
}

// TODO don't want to recreate this on the server every time
export const createApolloClient = (opts: { isServer: boolean }): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient(apolloClientConfig(opts))
};
