import { z } from 'zod'
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
  createPainter: Maybe<Painter>;
  createPainting: Maybe<Painting>;
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
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  techniques: Array<Technique>;
};

export type PainterInput = {
  country: Scalars['String']['input'];
  name: Scalars['String']['input'];
  techniques: Array<Scalars['String']['input']>;
};

export type Painting = {
  __typename?: 'Painting';
  date: Scalars['String']['output'];
  id: Scalars['String']['output'];
  painter: Painter;
  painterId: Scalars['String']['output'];
  technique: Technique;
  techniqueId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type PaintingInput = {
  date: Scalars['String']['input'];
  painterId: Scalars['String']['input'];
  techniqueId: Scalars['String']['input'];
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
  id: Scalars['String']['input'];
};


export type QueryPaintingArgs = {
  id: Scalars['String']['input'];
};

export type Technique = {
  __typename?: 'Technique';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};


type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny => v !== undefined && v !== null;

export const definedNonNullAnySchema = z.any().refine((v) => isDefinedNonNullAny(v));

export function PainterInputSchema(): z.ZodObject<Properties<PainterInput>> {
  return z.object({
    country: z.string(),
    name: z.string(),
    techniques: z.array(z.string())
  })
}

export function PaintingInputSchema(): z.ZodObject<Properties<PaintingInput>> {
  return z.object({
    date: z.string(),
    painterId: z.string(),
    techniqueId: z.string(),
    title: z.string()
  })
}
