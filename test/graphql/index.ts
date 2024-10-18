import { dataFactory } from '#test/utils';
import { GqlPainterInputSchema } from '@libs/graphql-validators';

export const createGqlPainterInput = dataFactory(GqlPainterInputSchema());
