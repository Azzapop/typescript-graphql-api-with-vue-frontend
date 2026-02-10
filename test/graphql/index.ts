import { dataFactory } from '#test/utils';
import { GqlUserProfileSchema } from '~libs/graphql-validators';

export const createGqlUserProfile = dataFactory(GqlUserProfileSchema());
