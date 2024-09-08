export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
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
  painters: Array<Maybe<Painter>>;
  painting: Maybe<Painting>;
  paintings: Array<Maybe<Painting>>;
};


export type QueryPainterArgs = {
  name: InputMaybe<Scalars['String']['input']>;
};


export type QueryPaintingArgs = {
  title: InputMaybe<Scalars['String']['input']>;
};

export type GetPaintersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaintersQuery = { __typename?: 'Query', painters: Array<{ __typename?: 'Painter', name: string, country: string } | null> };
