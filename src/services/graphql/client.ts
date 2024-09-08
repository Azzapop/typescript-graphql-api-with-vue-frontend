import { ApolloClient, InMemoryCache } from '@libs/@apollo/client/core';

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});
