import type {
  ApolloClientOptions,
  NormalizedCacheObject,
  ApolloLink,
} from '@apollo/client/core';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import type { GraphQLSchema } from 'graphql';

const createLink = (opts: {
  isServer: boolean;
  schema?: GraphQLSchema;
}): ApolloLink => {
  const { isServer, schema } = opts;

  if (isServer) {
    if (!schema)
      throw new Error(
        'Missing grqphql schema on server apollo client creation.'
      );
    return new SchemaLink({ schema });
  }

  return new HttpLink({ uri: '/graphql' });
};

const createConfig = (opts: {
  isServer: boolean;
  schema?: GraphQLSchema;
}): ApolloClientOptions<NormalizedCacheObject> => {
  const { isServer } = opts;

  return {
    ssrMode: isServer,
    cache: new InMemoryCache(),
    link: createLink(opts),
  };
};

// TODO consider using a dynamic import now that this is co-located with the schema
// If considering refactoring please note that 'schema' is passed in here to ensure that we do
// not include the entire schema (including resolvers) in the client build
export const createApolloClient = (opts: {
  isServer: boolean;
  schema?: GraphQLSchema;
}): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient(createConfig(opts));
};
