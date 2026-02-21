import { SchemaLink } from '@apollo/client/link/schema';
import type { GraphQLSchema } from 'graphql';
import type { ClientLink } from '../apollo-client-types';

export const createSchemaLink = (
  schema: GraphQLSchema,
  context?: Record<string, unknown>
): ClientLink => new SchemaLink({ schema, context });
