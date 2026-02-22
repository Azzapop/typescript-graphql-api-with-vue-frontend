### Testing

**Framework**: Vitest v2.1.9

**Current Coverage**: 87 unit tests across 15 test files

**Unit Tests Implemented** (Pure Functions):
- ✅ `async-handler.ts` - Express async error handling
- ✅ `auth-tokens/generate-token-version.ts` - Cryptographically secure UUID v4 generation
- ✅ `auth-tokens/access-tokens/sign-access-token.ts` - JWT signing for access tokens
- ✅ `auth-tokens/access-tokens/verify-access-token.ts` - JWT verification for access tokens
- ✅ `auth-tokens/refresh-tokens/sign-refresh-token.ts` - JWT signing for refresh tokens
- ✅ `auth-tokens/refresh-tokens/verify-refresh-token.ts` - JWT verification for refresh tokens
- ✅ `client-utils/assert.ts` - Runtime assertion utilities
- ✅ `domain-model/prisma/parse-prisma-error.ts` - Prisma error parsing and mapping
- ✅ `graphql-errors/*` - GraphQL error classes (BadInputError, BadParseError, InternalServerError, NotFoundError)
- ✅ `graphql-transformers/transform-user-profile.ts` - Prisma to GraphQL type transformations
- ✅ `logger/is-vite-request.ts` - Vite development server request detection
- ✅ `trace-token/generate-trace-token.ts` - Trace token generation for request tracking

**Not Tested** (Require Integration Tests):
- Domain model stores (database operations via Prisma)
- Authentication middleware and strategies
- GraphQL resolvers and context
- Module system (Express app mounting)
- SSR and client-side rendering
- API endpoints

**Running Tests**:
```bash
npm test                     # Run all tests in watch mode
npm run test:unit            # Run unit tests once
npm run test:unit:watch      # Run unit tests in watch mode
npm run test:integration     # Run integration tests once (not yet implemented)
npm run test:integration:watch  # Run integration tests in watch mode
npm run test:all             # Run all tests (unit + integration) once
```

All unit tests mock external dependencies (jose library for JWT operations, Prisma client) and test pure business logic with 100% coverage of testable utility functions.

---

### Integration Testing Strategy

**Goal**: Test component interactions with real dependencies (database, HTTP server, GraphQL) in isolated test environments.

**File Naming Convention**:
- Integration tests: `*.integration.test.ts`
- Unit tests: `*.test.ts`
- Location: Colocated in `__tests__/` directories alongside source code

**Test Database Setup**:
- Use separate test database (defined in test env vars)
- Vitest `beforeEach`/`afterEach` hooks to reset database state
- Prisma migrations applied automatically in test setup
- Seed minimal required data per test

**Test Categories**:

#### 1. Database/Store Integration Tests
**Location**: `src/libs/domain-model/stores/**/__tests__/*.integration.test.ts`

**Strategy**:
- Use real Prisma client connected to test database
- Test all store functions end-to-end
- Verify database constraints (unique, foreign keys, cascades)
- Test Result pattern error handling (duplicate keys, not found, etc.)

**Tests Needed**:
- **User Store** (`stores/user/`)
  - `create-with-local-credentials.ts` - Successful creation, duplicate username/email handling
  - `get-by-id.ts` - Found vs not found cases
  - `rotate-token-version.ts` - Token version updates, concurrent update handling

- **RefreshToken Store** (`stores/refresh-token/`)
  - `create-token.ts` - Token creation with user association
  - `find-youngest.ts` - Finding most recent token, handling empty results
  - `clear-token-family.ts` - Cascade deletion verification

- **LocalCredentials Store** (`stores/local-credentials/`)
  - `get-with-user.ts` - Join queries, password hash inclusion

**Example Pattern**:
```typescript
describe('UserStore.createWithLocalCredentials (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase(); // Helper to truncate tables
  });

  it('creates user and local credentials in transaction', async () => {
    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    // Verify in database
    const user = await prisma.user.findUnique({
      where: { id: result.data.id },
      include: { localCredentials: true }
    });
    expect(user).toBeDefined();
    expect(user.localCredentials).toBeDefined();
  });

  it('returns USERNAME_EXISTS when username is taken', async () => {
    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test1@example.com',
      password: 'password123',
    });

    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser', // duplicate
      email: 'test2@example.com',
      password: 'password123',
    });

    expect(result).toEqual({
      success: false,
      error: 'USERNAME_EXISTS',
    });
  });
});
```

#### 2. Authentication Integration Tests
**Location**: `src/libs/auth-middleware/__tests__/*.integration.test.ts`

**Strategy**:
- Use supertest to make HTTP requests to test Express app
- Test passport strategies with real JWT tokens and database
- Verify cookie handling, session management
- Test authentication failure modes

**Tests Needed**:
- **Local Credentials Strategy**
  - Successful login with valid credentials
  - Failed login with invalid username/password
  - Account lockout scenarios

- **Access Token Strategy**
  - Valid token authentication
  - Expired token handling
  - Invalid signature rejection
  - Token version mismatch (user logout scenario)

- **Refresh Token Strategy**
  - Valid refresh token exchange
  - Token reuse detection (security)
  - Token family invalidation

- **Authentication Middleware**
  - `authenticate('access-token', { onFailure: 'reject' })` - Blocks unauthenticated requests
  - `authenticate('access-token', { onFailure: 'allow' })` - Allows with undefined user
  - Multiple strategy attempts

**Example Pattern**:
```typescript
describe('Local Credentials Authentication (integration)', () => {
  let app: Express;
  let testUser: User;

  beforeEach(async () => {
    await cleanDatabase();
    app = createTestApp(); // Helper to create Express app with auth

    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    testUser = result.data;
  });

  it('authenticates with valid credentials and returns tokens', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({ username: 'testuser', password: 'password123' })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('rejects invalid password', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(401);

    expect(response.body.error).toBe('INVALID_CREDENTIALS');
  });
});
```

#### 3. GraphQL Integration Tests
**Location**: `src/modules/graphql/__tests__/*.integration.test.ts`

**Strategy**:
- Use Apollo Server's `executeOperation` for isolated GraphQL testing
- Create authenticated context with real user from test database
- Test resolvers with real database queries
- Verify GraphQL errors are properly formatted

**Tests Needed**:
- **Query Resolvers**
  - `me` - Returns current user profile
  - `user` - Returns user by ID with authorization checks

- **Mutation Resolvers**
  - User mutations with validation
  - Authorization checks (can only modify own data)

- **Context Creation**
  - Authenticated context includes user
  - Unauthenticated requests rejected before resolvers

- **Error Handling**
  - GraphQL error classes map to proper error codes
  - Not found scenarios
  - Validation errors

**Example Pattern**:
```typescript
describe('GraphQL me query (integration)', () => {
  let apolloServer: ApolloServer;
  let testUser: User;

  beforeEach(async () => {
    await cleanDatabase();
    apolloServer = createTestApolloServer(); // Helper

    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    testUser = result.data;
  });

  it('returns current user profile when authenticated', async () => {
    const response = await apolloServer.executeOperation(
      { query: 'query { me { id username email } }' },
      { contextValue: { user: testUser } }
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.data.me).toMatchObject({
      id: testUser.id,
      username: 'testuser',
      email: 'test@example.com',
    });
  });
});
```

#### 4. API Endpoint Integration Tests
**Location**: `src/modules/**/__tests__/*.integration.test.ts`

**Strategy**:
- Use supertest for full HTTP request/response testing
- Test complete request flow (middleware → route handler → response)
- Verify status codes, headers, response bodies
- Test error responses and validation

**Tests Needed**:
- **Auth Module** (`modules/auth/`)
  - POST `/auth/login/local` - Login flow
  - POST `/auth/refresh` - Token refresh flow
  - POST `/auth/logout` - Logout and token invalidation

- **Client Module** (`modules/client/`)
  - GET `/app` - SSR rendering with/without authentication
  - Static asset serving

- **GraphQL Module** (`modules/graphql/`)
  - POST `/graphql` - Full GraphQL request handling
  - Authentication requirement
  - Subscription handling (if implemented)

**Example Pattern**:
```typescript
describe('POST /auth/login/local (integration)', () => {
  let app: Express;

  beforeEach(async () => {
    await cleanDatabase();
    app = await createTestServer(); // Full server setup

    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('returns access and refresh tokens with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({ username: 'testuser', password: 'password123' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const cookies = response.headers['set-cookie'];
    expect(cookies.some(c => c.startsWith('access-token='))).toBe(true);
    expect(cookies.some(c => c.startsWith('refresh-token='))).toBe(true);
  });

  it('returns 401 with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(401);

    expect(response.body).toMatchObject({
      error: 'INVALID_CREDENTIALS',
    });
  });
});
```

#### 5. Module System Integration Tests
**Location**: `src/libs/module/__tests__/*.integration.test.ts`

**Strategy**:
- Test module mounting and path conflicts
- Verify module middleware execution order
- Test module context passing

**Tests Needed**:
- Module path uniqueness enforcement
- Module initialization with context
- Middleware chain execution
- Error handling in module configuration

**Test Utilities Required**:

Create helpers in `test/integration/`:
- `test/integration/database.ts` - Database cleanup, seeding
- `test/integration/app.ts` - Test Express app creation
- `test/integration/apollo.ts` - Test Apollo Server creation
- `test/integration/factories.ts` - Create test data in database
- `test/integration/auth.ts` - Generate valid tokens for testing

**Environment Setup**:
```bash
# test/.env.test
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/test_db"
JWT_ACCESS_SECRET="test-access-secret"
JWT_REFRESH_SECRET="test-refresh-secret"
NODE_ENV="test"
```

**Running Integration Tests** (once implemented):
```bash
npm run test:integration        # Run only integration tests once
npm run test:integration:watch  # Run integration tests in watch mode
npm run test:unit               # Run only unit tests once
npm run test:unit:watch         # Run unit tests in watch mode
npm run test:all                # Run both unit and integration tests once
```

**Implementation Order**:
1. Database/Store tests (foundation for others)
2. Authentication tests (needed for GraphQL/API)
3. GraphQL resolver tests
4. API endpoint tests
5. Module system tests

### Filenaming/Foldernaming

- Folders -> kebab-case
- Files -> kebab-case
- Exports camelCase, mathing file or folder name if index file
- only one export unless index file
- Anything generated must be in the .gitignore

### TODO

- Maybe type-ify the express injectors?
- Replace multi-line comments with /\*\*/
- Prefix resolver types with Gql on generate
- Only one / allowed per import
- lint rule so that test imports '#' can't be in prod files
- swagger validation middleware
- update functions to only pass what is needed
- nvim ejs syntax highlighting
- nvim vue syntax highlighting and ts validation
- ✅ unit tests for pure utility functions (87 tests)
- integration tests for stores, auth, GraphQL, and API endpoints
- use find instead of get in stores
- setup individual apps to have their own express server, plugs into main one through /<identifier> (only client left)
- use operationId for the route types
- split prisma schema into different modules
- create for things that are saved, generate for things that are created on the fly
- way to mark libs as server or client facing
- better error handling on the client using codes from the backend. Error handler lib for both express errors and gql errors. Should catch errors from external libs at boundaries using result pattern, then convert them to the corresponding error at the top level for the resolver or route handler
- standard fontsize for labels and icons so it's not set everywhere
- figure out a better pattern for the navbar to handle dropdowns and collapse on mobile. Move the user dropdown to the end
- composables for menu toggles to make it more generic
- logging in dev, log basic error message, turn on json logging based on config
- pull out module logger to it's own config
- Store settings in local storage for client
- doc for auth flow
- doc for client flow
- doc for gql flow
- const for token cookies names
- honestly just clean up the whole script for generate auth types
- better auth lib and handling for the client
- browser entry over server entry
- gitignore i18n compiled files
- Split public and private clients to make auth handling neater, this will also tidy up the hydration handling
- fix load order so css is loaded first

### GraphQL Mappers

If you want to resolve certain fields in the model resolvers, ensure that you add a mapper to omit that field in the codegen.ts file. Examples are there to guide you.
