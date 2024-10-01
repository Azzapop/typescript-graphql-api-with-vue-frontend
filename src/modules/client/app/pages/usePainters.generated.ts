import type * as Types from '@modules/graphql/types.generated';

export type GqlGetPaintersQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GqlGetPaintersQuery = {
  __typename?: 'Query';
  painters: Array<{ __typename?: 'Painter'; name: string; country: string }>;
};
