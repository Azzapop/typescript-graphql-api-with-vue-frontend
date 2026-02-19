# CLAUDE.md

## Project Overview

Full-stack TypeScript application with a GraphQL API backend and Vue 3 SSR frontend.

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Backend**: Express, Apollo Server (GraphQL)
- **Frontend**: Vue 3 with SSR, Pinia, PrimeVue, vue-i18n
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod (for both Prisma and GraphQL schemas)
- **Build**: Vite
- **Auth**: Passport.js with JWT tokens

## Project Structure

```
src/
├── index.ts              # Server entry point
├── server.ts             # Express server setup
├── libs/                 # Shared libraries
│   ├── domain-model/     # Prisma models, stores, types
│   │   ├── models/       # TypeScript types for domain entities
│   │   ├── stores/       # Data access functions (one dir per entity)
│   │   ├── prisma/       # Prisma client and utilities
│   │   └── types/        # Shared types (Result, etc.)
│   ├── module/           # Module system (createModule, mountModules)
│   ├── graphql-types/    # Generated GraphQL TypeScript types
│   ├── graphql-validators/ # Generated Zod schemas for GraphQL
│   ├── graphql-transformers/ # Prisma → GraphQL transformers
│   ├── graphql-errors/   # GraphQL error classes
│   ├── prisma-validators/ # Generated Zod schemas for Prisma
│   ├── logger/           # Logging utilities
│   ├── trace-context/    # Request tracing (AsyncLocalStorage)
│   ├── trace-token/      # Trace token generation
│   └── auth-*/           # Authentication utilities
├── modules/              # Each module has an entry.ts
│   ├── graphql/          # GraphQL module (/graphql)
│   │   ├── entry.ts
│   │   ├── type-defs.graphql
│   │   └── resolvers/
│   ├── auth/             # Auth module (/auth)
│   │   └── entry.ts
│   └── client/           # Client module (/app)
│       ├── entry.ts
│       └── app/
│           ├── pages/
│           ├── layout/
│           └── components/
scripts/                  # Utility scripts (run with vite-node)
test/                     # Test utilities and factories
```

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run tsc              # Type check
npm run lint             # Lint code
npm run graphql:types    # Regenerate GraphQL types
npm run db:migrate       # Run Prisma migrations
npm run db:format        # Format Prisma schema
npm run db:create-user   # Create seed user from env vars
```

## Key Patterns

### Result Type

Store functions return `Result<T, E>` instead of throwing errors:

```typescript
type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### Prisma Error Handling

Use `parsePrismaError()` at the Prisma boundary to convert errors:

```typescript
try {
  const data = await prisma.user.create({ ... });
  return { success: true, data };
} catch (e) {
  const error = parsePrismaError(e);
  if (error.code === 'UNIQUE_CONSTRAINT' && error.fields.includes('username')) {
    return { success: false, error: 'USERNAME_EXISTS' };
  }
  return { success: false, error: 'UNEXPECTED_ERROR' };
}
```

### Store Functions

- Located in `src/libs/domain-model/stores/<entity>/`
- One function per file, exported via index
- Return types from `models/`, not Prisma types directly
- Use `Result` type for operations that can fail

### GraphQL Context

GraphQL **always requires authentication**. The `GraphQLContext` type enforces a required `user` field:

```typescript
// src/modules/graphql/graphql-context.ts
export type GraphQLContext = {
  user: User; // Required - GraphQL is auth-only
};
```

Key points:
- All GraphQL resolvers have access to `context.user` (never null/undefined)
- The GraphQL endpoint requires `access-token` authentication before reaching resolvers
- Public routes (login, error pages) should not make GraphQL queries
- SSR passes proper context when authenticated, empty object when not

```typescript
// Resolver example - user is always present when context has user
export const me: GqlQueryResolvers['me'] = async (_parent, _args, context) => {
  // context.user is guaranteed to exist when GraphQL queries are executed
  const profile = await UserProfileStore.getByUserId(context.user.id);
  // ...
};
```

### GraphQL Transformers

Transform Prisma types to GraphQL types with validation:

```typescript
const PRISMA_TO_GQL = UserProfileSchema.transform(
  ({ id, email }): GqlResolversTypes['UserProfile'] => ({ id, email: email ?? null })
);
```

### API Clients

Always use generated API clients instead of `fetch` for making API requests:

```typescript
// Frontend - use the auth-api-client
import { HttpClient, LoginClient } from '~packages/auth-api-client';

const httpClient = new HttpClient({ baseURL: '/auth', withCredentials: true });
const loginClient = new LoginClient(httpClient);

const response = await loginClient.localCreate({
  username: 'user',
  password: 'pass',
});
```

Benefits:
- Type-safe requests and responses
- Automatic error handling
- Consistent API usage across the codebase
- Generated from Swagger/OpenAPI specs

API clients are located in `src/packages/<api-name>-client/` and are auto-generated.

### Logging

Use the logger from `~libs/logger`:

```typescript
import { logger } from '~libs/logger';
logger.info('Message');
logger.error('Error message');
```

### Trace Context

Wrap operations with trace context for request tracking:

```typescript
import { runWithTrace } from '~libs/trace-context';
import { generateTraceToken } from '~libs/trace-token';

runWithTrace({ traceToken: generateTraceToken() }, async () => {
  // All logs within will include the trace token
});
```

### Modules

Each module is its own Express app mounted at a specific path on the main server:

```typescript
// Module entry point (src/modules/<name>/entry.ts)
import { createModule } from '~libs/module';

export const entry = (context: ModuleContext = {}) =>
  createModule({
    path: '/auth',
    configure: (router, context) => {
      router.use(middleware);
      router.use(handler);
    },
  }, context);
```

Modules are mounted in `server.ts`:

```typescript
const modules = await Promise.all([
  authEntry(),
  graphqlEntry({ httpServer }),
  clientEntry(),
]);
mountModules(expressServer, modules);
```

Module paths must be unique - `mountModules` will throw if duplicates are detected.

## Path Aliases

Configured in `tsconfig.json`:

- `~libs/*` → `./src/libs/*`
- `~modules/*` → `./src/modules/*`
- `~packages/*` → `./src/packages/*`
- `@app/*` → `./src/modules/client/app/*`
- `#test/*` → `./test/*`

## Generated Files

Do not edit directly - these are regenerated:

- `src/libs/graphql-types/index.ts` - Run `npm run graphql:types`
- `src/libs/graphql-validators/index.ts` - Run `npm run graphql:types`
- `src/libs/prisma-validators/zod/` - Run `npx prisma generate`
- `src/modules/client/**/*.gql.ts` - Run `npm run graphql:types`
- `src/packages/*-client/` - API clients generated from Swagger/OpenAPI specs

## Environment Variables

Required in `.env`:

```
PORT=3000
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET=your-secret-key-min-32-chars
SEED_USERNAME=admin       # For db:create-user script
SEED_PASSWORD=password    # For db:create-user script
```

## Conventions

### File Naming and Exports

- One export per file
- Filenames in kebab-case, export name in camelCase matching the filename
- Example: `create-user.ts` exports `createUser`

Exceptions:
- `index.ts` - re-exports combined values from the directory
- `<directory-name>-types.ts` - contains types for the directory
- `<directory-name>-const.ts` - contains constant values for the directory
- `<directory-name>-config.ts` - contains config for the directory

```
stores/user/
├── index.ts                        # export { createUser } from './create-user'
├── user-types.ts                   # type CreateUserInput = { ... }
├── user-const.ts                   # const SALT_ROUNDS = 10
├── create-user.ts                  # export const createUser = ...
└── get-by-id.ts                    # export const getById = ...
```

```
libs/auth-tokens/
├── index.ts                        # export { authTokensConfig } from './auth-tokens-config'
├── auth-tokens-config.ts           # export const authTokensConfig = createConfig(...)
├── access-tokens/
│   ├── index.ts
│   ├── access-tokens-const.ts      # export const ACCESS_SECRET = ...
│   ├── sign-access-token.ts
│   └── verify-access-token.ts
└── refresh-tokens/
    ├── index.ts
    ├── refresh-tokens-const.ts     # export const REFRESH_SECRET = ...
    ├── sign-refresh-token.ts
    └── verify-refresh-token.ts
```

### Function Typing

Functions should either be typed at the variable or specify all input and output types:

```typescript
// Option 1: Type at the variable
const getUser: (id: string) => Promise<User> = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

// Option 2: Specify all input and output types
const getUser = async (id: string): Promise<User> => {
  return prisma.user.findUnique({ where: { id } });
};

// NOT allowed: Missing return type
const getUser = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};
```

### TypeScript

- Never use `as` type assertions — use type guards instead:

```typescript
// NOT allowed
const code = value as string;

// Correct
const code = typeof value === 'string' ? value : undefined;
```

### CSS and Styling

**BEM Methodology**

- Always use BEM (Block Element Modifier) methodology for CSS class names
- Never style HTML elements directly - always apply classes following BEM pattern

```vue
<!-- NOT allowed: Direct element styling -->
<template>
  <div class="user-card">
    <h1>Title</h1>
    <p>Description</p>
    <code>example</code>
  </div>
</template>

<style>
.user-card {
  p { margin-bottom: 1rem; }
  code { background: gray; }
}
</style>

<!-- Correct: BEM classes -->
<template>
  <div class="user-card">
    <h1 class="user-card__title">Title</h1>
    <p class="user-card__text">Description</p>
    <code class="user-card__code">example</code>
  </div>
</template>

<style>
.user-card {
  &__title { margin-top: 0; }
  &__text { margin-bottom: 1rem; }
  &__code { background: gray; }
}
</style>
```

**CSS Variables**

- Never use PrimeVue CSS variables directly (`--p-*`)
- Define custom CSS variables in `src/modules/client/app/assets/styles/layout/variables/`
  - `_common.scss` - Variables for both light and dark themes
  - `_light.scss` - Light theme specific overrides
  - `_dark.scss` - Dark theme specific overrides
- Components should only reference custom variables

```scss
// NOT allowed: Direct PrimeVue variables in components
.my-component {
  color: var(--p-primary-color);
  background: var(--p-surface-100);
}

// Correct: Custom variables
.my-component {
  color: var(--primary-color);
  background: var(--surface-100);
}

// In _common.scss - map PrimeVue to custom variables
:root {
  --primary-color: var(--p-primary-color);
  --surface-100: var(--p-surface-100);
}
```

### Other

- Timestamps (`createdAt`, `updatedAt`) are auto-generated by Prisma
- Use `@updatedAt` directive on all `updatedAt` fields
- Avoid throwing errors where possible - use Result types
- Scripts should run with trace context
- Store functions handle Prisma errors internally and return domain-specific error codes
