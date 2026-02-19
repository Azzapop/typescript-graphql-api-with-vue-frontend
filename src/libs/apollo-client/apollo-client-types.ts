import type { ApolloLink } from '@apollo/client/core';

// Opaque link type — consumers use this without importing from Apollo
export type ClientLink = ApolloLink;

export type GraphQLErrorInfo = {
  message: string;
  code?: string;
  path?: readonly (string | number)[];
};

export type NetworkErrorInfo = {
  message: string;
  statusCode?: number;
};
