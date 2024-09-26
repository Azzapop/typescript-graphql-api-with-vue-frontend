import { GraphQLResolveInfo } from 'graphql';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type GqlMutation = {
  __typename?: 'Mutation';
  createPainter: GqlPainter;
  createPainting: GqlPainting;
};

export type GqlMutationCreatePainterArgs = {
  input: GqlPainterInput;
};

export type GqlMutationCreatePaintingArgs = {
  input: GqlPaintingInput;
};

export type GqlPainter = {
  __typename?: 'Painter';
  country: Scalars['String']['output'];
  name: Scalars['String']['output'];
  techniques: Array<GqlTechnique>;
};

export type GqlPainterInput = {
  country: Scalars['String']['input'];
  name: Scalars['String']['input'];
  techniques: Array<Scalars['String']['input']>;
};

export type GqlPainting = {
  __typename?: 'Painting';
  author: Scalars['String']['output'];
  date: Scalars['String']['output'];
  technique: GqlTechnique;
  title: Scalars['String']['output'];
};

export type GqlPaintingInput = {
  author: Scalars['String']['input'];
  date: Scalars['String']['input'];
  technique: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type GqlQuery = {
  __typename?: 'Query';
  painter: Maybe<GqlPainter>;
  painters: Array<GqlPainter>;
  painting: Maybe<GqlPainting>;
  paintings: Array<GqlPainting>;
};

export type GqlQueryPainterArgs = {
  id: Scalars['String']['input'];
};

export type GqlQueryPaintingArgs = {
  id: Scalars['String']['input'];
};

export type GqlTechnique = {
  __typename?: 'Technique';
  name: Scalars['String']['output'];
};

export type GqlGetPaintersQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetPaintersQuery = {
  __typename?: 'Query';
  painters: Array<{ __typename?: 'Painter'; name: string; country: string }>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Painter: ResolverTypeWrapper<Pick<GqlPainter, 'name' | 'country'>>;
  PainterInput: GqlPainterInput;
  Painting: ResolverTypeWrapper<GqlPainting>;
  PaintingInput: GqlPaintingInput;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Technique: ResolverTypeWrapper<GqlTechnique>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Mutation: {};
  Painter: Pick<GqlPainter, 'name' | 'country'>;
  PainterInput: GqlPainterInput;
  Painting: GqlPainting;
  PaintingInput: GqlPaintingInput;
  Query: {};
  String: Scalars['String']['output'];
  Technique: GqlTechnique;
};

export type GqlMutationResolvers<
  ContextType = any,
  ParentType extends
    GqlResolversParentTypes['Mutation'] = GqlResolversParentTypes['Mutation'],
> = {
  createPainter: Resolver<
    GqlResolversTypes['Painter'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreatePainterArgs, 'input'>
  >;
  createPainting: Resolver<
    GqlResolversTypes['Painting'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreatePaintingArgs, 'input'>
  >;
};

export type GqlPainterResolvers<
  ContextType = any,
  ParentType extends
    GqlResolversParentTypes['Painter'] = GqlResolversParentTypes['Painter'],
> = {
  country: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  techniques: Resolver<
    Array<GqlResolversTypes['Technique']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlPaintingResolvers<
  ContextType = any,
  ParentType extends
    GqlResolversParentTypes['Painting'] = GqlResolversParentTypes['Painting'],
> = {
  author: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  date: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  technique: Resolver<GqlResolversTypes['Technique'], ParentType, ContextType>;
  title: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQueryResolvers<
  ContextType = any,
  ParentType extends
    GqlResolversParentTypes['Query'] = GqlResolversParentTypes['Query'],
> = {
  painter: Resolver<
    Maybe<GqlResolversTypes['Painter']>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryPainterArgs, 'id'>
  >;
  painters: Resolver<
    Array<GqlResolversTypes['Painter']>,
    ParentType,
    ContextType
  >;
  painting: Resolver<
    Maybe<GqlResolversTypes['Painting']>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryPaintingArgs, 'id'>
  >;
  paintings: Resolver<
    Array<GqlResolversTypes['Painting']>,
    ParentType,
    ContextType
  >;
};

export type GqlTechniqueResolvers<
  ContextType = any,
  ParentType extends
    GqlResolversParentTypes['Technique'] = GqlResolversParentTypes['Technique'],
> = {
  name: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlResolvers<ContextType = any> = {
  Mutation: GqlMutationResolvers<ContextType>;
  Painter: GqlPainterResolvers<ContextType>;
  Painting: GqlPaintingResolvers<ContextType>;
  Query: GqlQueryResolvers<ContextType>;
  Technique: GqlTechniqueResolvers<ContextType>;
};
