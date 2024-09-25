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

export type Mutation = {
  __typename?: 'Mutation';
  createPainter: Painter;
  createPainting: Painting;
};

export type MutationCreatePainterArgs = {
  input: PainterInput;
};

export type MutationCreatePaintingArgs = {
  input: PaintingInput;
};

export type Painter = {
  __typename?: 'Painter';
  country: Scalars['String']['output'];
  name: Scalars['String']['output'];
  techniques: Array<Maybe<Scalars['String']['output']>>;
};

export type PainterInput = {
  country: Scalars['String']['input'];
  name: Scalars['String']['input'];
  techniques: Array<InputMaybe<Scalars['String']['input']>>;
};

export type Painting = {
  __typename?: 'Painting';
  author: Scalars['String']['output'];
  date: Scalars['String']['output'];
  technique: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type PaintingInput = {
  author: Scalars['String']['input'];
  date: Scalars['String']['input'];
  technique: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  painter: Maybe<Painter>;
  painters: Array<Painter>;
  painting: Maybe<Painting>;
  paintings: Array<Painting>;
};

export type QueryPainterArgs = {
  name: InputMaybe<Scalars['String']['input']>;
};

export type QueryPaintingArgs = {
  title: InputMaybe<Scalars['String']['input']>;
};

export type GetPaintersQueryVariables = Exact<{ [key: string]: never }>;

export type GetPaintersQuery = {
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
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Painter: ResolverTypeWrapper<Painter>;
  PainterInput: PainterInput;
  Painting: ResolverTypeWrapper<Painting>;
  PaintingInput: PaintingInput;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Mutation: {};
  Painter: Painter;
  PainterInput: PainterInput;
  Painting: Painting;
  PaintingInput: PaintingInput;
  Query: {};
  String: Scalars['String']['output'];
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  createPainter: Resolver<
    ResolversTypes['Painter'],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePainterArgs, 'input'>
  >;
  createPainting: Resolver<
    ResolversTypes['Painting'],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePaintingArgs, 'input'>
  >;
};

export type PainterResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Painter'] = ResolversParentTypes['Painter'],
> = {
  country: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  techniques: Resolver<
    Array<Maybe<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaintingResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Painting'] = ResolversParentTypes['Painting'],
> = {
  author: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  technique: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  painter: Resolver<
    Maybe<ResolversTypes['Painter']>,
    ParentType,
    ContextType,
    QueryPainterArgs
  >;
  painters: Resolver<Array<ResolversTypes['Painter']>, ParentType, ContextType>;
  painting: Resolver<
    Maybe<ResolversTypes['Painting']>,
    ParentType,
    ContextType,
    QueryPaintingArgs
  >;
  paintings: Resolver<
    Array<ResolversTypes['Painting']>,
    ParentType,
    ContextType
  >;
};

export type Resolvers<ContextType = any> = {
  Mutation: MutationResolvers<ContextType>;
  Painter: PainterResolvers<ContextType>;
  Painting: PaintingResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
};
