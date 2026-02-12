/**
 * We re-export specific Schemas here for a couple of reasons:
 *
 * 1. The 'zod-prisma-types' library clears the directory when generating. We generate our
 * into `zod` to avoid clearing any files from this directory.
 *
 * 2. The library also generates inferred types from the schemas, however we would prefer to use
 * the Prisma client types directly where possible.
 *
 * TODO maybe make a PR to the library to generate the types on a flag?
 */
export { LocalCredentialsSchema, UserProfileSchema } from './zod';
