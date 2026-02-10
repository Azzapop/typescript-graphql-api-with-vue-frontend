import { dataFactory } from '#test/utils';
import { UserProfileSchema } from '~libs/prisma-validators';

export const createUserProfile = dataFactory(UserProfileSchema);
