# Integration Testing Strategy

**Version**: 1.0
**Last Updated**: 2026-02-22
**Status**: 📋 Ready for Implementation
**Parent Document**: [Testing Strategy Overview](./TESTING_STRATEGY.md)

---

## Status

This document provides a **complete strategy** for implementing integration tests. Unit testing infrastructure is complete (87 tests), and this strategy is ready for implementation.

Integration tests verify that **multiple units work together correctly** with **real external dependencies** (database, HTTP server, GraphQL server).

---

## Planned Scope

### What Will Be Integration Tested

**Store Functions** (`src/libs/domain-model/stores/**`):
- All functions that use Prisma client
- Real PostgreSQL database interactions
- Transaction handling
- Constraint validation
- Error scenarios (unique constraints, foreign keys, etc.)

**GraphQL Resolvers** (`src/modules/graphql/resolvers/**`):
- End-to-end resolver execution
- Real database queries via stores
- GraphQL error handling
- Context usage
- Data transformations

**Authentication Flows** (`src/libs/auth-middleware/**`, `src/modules/auth/routes/**`):
- Login flow (username/password → JWT tokens)
- Token refresh flow
- Token validation
- Password hashing and verification
- Session management

**API Route Handlers** (`src/modules/auth/routes/**`):
- Express route handling
- Request validation
- Response formatting
- Error handling
- Authentication middleware

**SSR Rendering** (`src/modules/client/**`):
- Server-side GraphQL queries
- Page rendering with data
- Error boundaries
- Redirect handling

---

## File Naming and Organization

**Convention**: Integration tests use `*.int.test.ts` naming

```
src/libs/domain-model/stores/user/
├── __tests__/
│   ├── create-with-local-credentials.test.ts      # Unit test (if pure logic exists)
│   └── create-with-local-credentials.int.test.ts  # Integration test with DB
├── create-with-local-credentials.ts
└── index.ts
```

**Separation**:
- Unit tests: `*.test.ts` - Run by default with `npm test` or `npm run test:unit`
- Integration tests: `*.int.test.ts` - Run with `npm run test:integration`

**Benefits**:
- Clear distinction between test types
- Can run unit tests quickly without database
- Integration tests use separate Vitest config with longer timeouts

---

## Test Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest watch",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:integration:watch": "vitest watch --config vitest.integration.config.ts",
    "test:all": "npm run test:unit && npm run test:integration"
  }
}
```

---

## Detailed Implementation Topics

### 1. Test Database Setup

**Strategy**: Use separate test database with automatic cleanup

**Environment Configuration** (`.env.test`):
```bash
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/test_db"
JWT_ACCESS_SECRET="test-access-secret"
JWT_REFRESH_SECRET="test-refresh-secret"
NODE_ENV="test"
```

**Test Database Management** (for parallel execution):

**Approach**: Use unique test data per test to enable parallel execution

```typescript
// test/integration/database.ts
import { PrismaClient } from '~libs/domain-model/prisma';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

/**
 * Generate unique test prefix for parallel test isolation
 * Each test gets a unique prefix to avoid data collisions
 */
export const createTestPrefix = (): string => {
  return `test_${randomBytes(8).toString('hex')}`;
};

/**
 * Cleanup test data by prefix
 * Call this in afterEach to clean up data created by the test
 */
export const cleanupTestData = async (prefix: string) => {
  // Delete data created by this specific test (match by username/email prefix)
  await prisma.refreshToken.deleteMany({
    where: {
      user: {
        username: { startsWith: prefix },
      },
    },
  });
  await prisma.localCredentials.deleteMany({
    where: {
      user: {
        username: { startsWith: prefix },
      },
    },
  });
  await prisma.userProfile.deleteMany({
    where: {
      user: {
        username: { startsWith: prefix },
      },
    },
  });
  await prisma.user.deleteMany({
    where: {
      username: { startsWith: prefix },
    },
  });
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
```

**Alternative Approach**: Transaction-based isolation (Prisma supports this)

```typescript
// test/integration/database.ts
import { PrismaClient } from '~libs/domain-model/prisma';

export const createTestTransaction = async () => {
  const prisma = new PrismaClient();

  return prisma.$transaction(
    async (tx) => {
      // Test code runs here with tx instead of prisma
      // Transaction is automatically rolled back after test
      return tx;
    },
    {
      maxWait: 30000,
      timeout: 30000,
    }
  );
};
```

**Recommended**: Use unique test prefixes for simplicity and better debugging.
Transaction-based isolation can be complex with async operations and may require
wrapping the entire test suite.

**Vitest Integration Config** (`vitest.integration.config.ts`):
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.int.test.ts'],
    testTimeout: 30000,  // Longer for DB operations
    hookTimeout: 30000,
  },
});
```

### 2. Data Seeding and Cleanup

**Approach**: Use unique test prefixes to enable parallel test execution

**Test Pattern**:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestPrefix, cleanupTestData } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';

describe('UserStore.createWithLocalCredentials (integration)', () => {
  let testPrefix: string;

  beforeEach(() => {
    testPrefix = createTestPrefix();  // Unique prefix for this test
  });

  afterEach(async () => {
    await cleanupTestData(testPrefix);  // Clean up this test's data
  });

  it('creates user and credentials in transaction', async () => {
    const result = await UserStore.createWithLocalCredentials({
      username: `${testPrefix}_testuser`,
      email: `${testPrefix}_test@example.com`,
      password: 'password123',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe(`${testPrefix}_testuser`);
    }
  });

  it('returns USERNAME_EXISTS for duplicate username', async () => {
    // First creation
    await UserStore.createWithLocalCredentials({
      username: `${testPrefix}_testuser`,
      email: `${testPrefix}_test1@example.com`,
      password: 'password123',
    });

    // Duplicate creation
    const result = await UserStore.createWithLocalCredentials({
      username: `${testPrefix}_testuser`,  // Same username
      email: `${testPrefix}_test2@example.com`,
      password: 'password123',
    });

    expect(result).toEqual({
      success: false,
      error: 'USERNAME_EXISTS',
    });
  });
});
```

**Why This Approach?**
- ✅ **Parallel execution** - Each test uses unique prefixes, no conflicts
- ✅ **Isolation** - Tests don't interfere with each other
- ✅ **Debugging** - Easy to identify test data in database
- ✅ **Cleanup** - Explicit cleanup per test, no global state
- ✅ **Simple** - No complex transaction management

**Alternative: Vitest's `pool: 'forks'`** for process isolation (slower but complete isolation)

### 3. Prisma Testing Patterns

**Key Principle**: Use REAL Prisma client - never mock the database

**Testing CRUD Operations**:
```typescript
describe('UserStore.getById (integration)', () => {
  let testPrefix: string;

  beforeEach(() => {
    testPrefix = createTestPrefix();
  });

  afterEach(async () => {
    await cleanupTestData(testPrefix);
  });

  it('returns user when found', async () => {
    // Arrange: Create test data
    const createResult = await UserStore.createWithLocalCredentials({
      username: `${testPrefix}_testuser`,
      email: `${testPrefix}_test@example.com`,
      password: 'password123',
    });
    const userId = createResult.data.id;

    // Act: Test the function
    const result = await UserStore.getById(userId);

    // Assert: Verify result
    expect(result).toEqual({
      success: true,
      data: expect.objectContaining({
        id: userId,
        username: `${testPrefix}_testuser`,
      }),
    });
  });

  it('returns NOT_FOUND when user does not exist', async () => {
    const result = await UserStore.getById('non-existent-id');

    expect(result).toEqual({
      success: false,
      error: 'NOT_FOUND',
    });
  });
});
```

**Testing Unique Constraints**:
```typescript
it('returns USERNAME_EXISTS when username is taken', async () => {
  // Arrange: Create first user
  await UserStore.createWithLocalCredentials({
    username: `${testPrefix}_testuser`,
    email: `${testPrefix}_test1@example.com`,
    password: 'password123',
  });

  // Act: Try to create duplicate username
  const result = await UserStore.createWithLocalCredentials({
    username: `${testPrefix}_testuser`,  // Same username
    email: `${testPrefix}_test2@example.com`,  // Different email
    password: 'password123',
  });

  // Assert: Verify proper error handling
  expect(result).toEqual({
    success: false,
    error: 'USERNAME_EXISTS',
  });
});
```

**Testing Transactions**:
```typescript
it('rolls back both user and credentials on failure', async () => {
  // This would require intentionally causing a failure
  // to verify transaction rollback behavior
  // Implementation depends on store function structure
});
```

### 4. GraphQL Resolver Testing

**Strategy**: Test GraphQL through HTTP endpoint using supertest (same as REST endpoints)

**Why supertest for GraphQL?**
- ✅ Consistent with REST API testing approach
- ✅ Tests the full HTTP stack (middleware, authentication, etc.)
- ✅ No need for additional libraries
- ✅ Tests exactly how clients will call GraphQL

**Alternative Libraries** (if needed):
- `@apollo/server`'s `executeOperation()` - Unit tests for resolvers (skips HTTP layer)
- `graphql-request` - Lightweight client (but supertest is simpler)

**Recommended**: Use **supertest** for integration tests to test the complete HTTP flow

**Testing Queries** (with supertest):
```typescript
import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '#test/integration/app';
import { createTestPrefix, cleanupTestData } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';

describe('GraphQL me query (integration)', () => {
  let app: Express;
  let testPrefix: string;
  let accessToken: string;

  beforeEach(async () => {
    testPrefix = createTestPrefix();
    app = await createTestApp();

    // Create test user
    const userResult = await UserStore.createWithLocalCredentials({
      username: `${testPrefix}_testuser`,
      email: `${testPrefix}_test@example.com`,
      password: 'password123',
    });

    // Login to get access token
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({
        username: `${testPrefix}_testuser`,
        password: 'password123',
      });

    accessToken = loginResponse.body.accessToken;
  });

  afterEach(async () => {
    await cleanupTestData(testPrefix);
  });

  it('returns current user profile when authenticated', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Cookie', [`access-token=${accessToken}`])
      .send({
        query: `
          query {
            me {
              id
              username
              email
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.me).toMatchObject({
      username: `${testPrefix}_testuser`,
      email: `${testPrefix}_test@example.com`,
    });
  });

  it('returns error when not authenticated', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `query { me { id username } }`,
      })
      .expect(401);
  });
});
```

**Testing Mutations**:
```typescript
it('creates resource with valid input', async () => {
  const response = await request(app)
    .post('/graphql')
    .set('Cookie', [`access-token=${accessToken}`])
    .send({
      query: `
        mutation CreateSomething($input: CreateInput!) {
          createSomething(input: $input) {
            id
            name
          }
        }
      `,
      variables: {
        input: { name: 'Test Resource' },
      },
    })
    .expect(200);

  expect(response.body.data.createSomething).toMatchObject({
    name: 'Test Resource',
  });

  // Verify data was actually created in database
  const created = await prisma.something.findFirst({
    where: { name: 'Test Resource' },
  });
  expect(created).toBeDefined();
});
```

**Testing GraphQL Errors**:
```typescript
it('returns NOT_FOUND error for non-existent resource', async () => {
  const response = await request(app)
    .post('/graphql')
    .set('Cookie', [`access-token=${accessToken}`])
    .send({
      query: `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            username
          }
        }
      `,
      variables: { id: 'non-existent-id' },
    })
    .expect(200);  // GraphQL returns 200 with errors in body

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].extensions.code).toBe('NOT_FOUND');
});
```

### 5. Authentication Testing

**Strategy**: Test full HTTP request/response cycle with supertest

**Test Setup**:
```typescript
// test/integration/app.ts
import express from 'express';
import { authEntry } from '~modules/auth/entry';
import { graphqlEntry } from '~modules/graphql/entry';

export const createTestApp = async () => {
  const app = express();

  // Mount modules
  const [authModule, graphqlModule] = await Promise.all([
    authEntry(),
    graphqlEntry({ httpServer }),
  ]);

  app.use(authModule.path, authModule.router);
  app.use(graphqlModule.path, graphqlModule.router);

  return app;
};
```

**Testing Login Flow**:
```typescript
import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '#test/integration/app';
import { createTestPrefix, cleanupTestData } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';

describe('POST /auth/login/local (integration)', () => {
  let app: Express;
  let testPrefix: string;

  beforeEach(async () => {
    testPrefix = createTestPrefix();
    app = await createTestApp();

    // Create test user
    await UserStore.createWithLocalCredentials({
      username: `${testPrefix}_testuser`,
      email: `${testPrefix}_test@example.com`,
      password: 'password123',
    });
  });

  afterEach(async () => {
    await cleanupTestData(testPrefix);
  });

  it('returns tokens with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({
        username: `${testPrefix}_testuser`,
        password: 'password123',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    // Verify cookies
    const cookies = response.headers['set-cookie'];
    expect(cookies.some(c => c.startsWith('access-token='))).toBe(true);
    expect(cookies.some(c => c.startsWith('refresh-token='))).toBe(true);
  });

  it('returns 401 with invalid password', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({
        username: `${testPrefix}_testuser`,
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body).toMatchObject({
      error: 'INVALID_CREDENTIALS',
    });
  });

  it('returns 401 with non-existent username', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({
        username: `${testPrefix}_nonexistent`,
        password: 'password123',
      })
      .expect(401);

    expect(response.body).toMatchObject({
      error: 'INVALID_CREDENTIALS',
    });
  });
});
```

**Testing Token Refresh**:
```typescript
describe('POST /auth/refresh (integration)', () => {
  let app: Express;
  let testPrefix: string;

  beforeEach(async () => {
    testPrefix = createTestPrefix();
    app = await createTestApp();

    await UserStore.createWithLocalCredentials({
      username: `${testPrefix}_testuser`,
      email: `${testPrefix}_test@example.com`,
      password: 'password123',
    });
  });

  afterEach(async () => {
    await cleanupTestData(testPrefix);
  });

  it('issues new tokens with valid refresh token', async () => {
    // Login to get initial tokens
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({
        username: `${testPrefix}_testuser`,
        password: 'password123',
      });

    const refreshToken = loginResponse.body.refreshToken;

    // Use refresh token to get new tokens
    const response = await request(app)
      .post('/auth/refresh')
      .set('Cookie', [`refresh-token=${refreshToken}`])
      .expect(200);

    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    // New refresh token should be different (rotation)
    expect(response.body.refreshToken).not.toBe(refreshToken);
  });

  it('rejects reused refresh token (security)', async () => {
    // Get initial tokens
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({
        username: `${testPrefix}_testuser`,
        password: 'password123',
      });

    const refreshToken = loginResponse.body.refreshToken;

    // Use refresh token once (should succeed)
    await request(app)
      .post('/auth/refresh')
      .set('Cookie', [`refresh-token=${refreshToken}`])
      .expect(200);

    // Try to reuse same refresh token (should fail - token reuse detection)
    await request(app)
      .post('/auth/refresh')
      .set('Cookie', [`refresh-token=${refreshToken}`])
      .expect(401);
  });
});
```

**Testing Authentication Middleware**:
```typescript
describe('Access token authentication (integration)', () => {
  let app: Express;
  let testPrefix: string;

  beforeEach(async () => {
    testPrefix = createTestPrefix();
    app = await createTestApp();

    await UserStore.createWithLocalCredentials({
      username: `${testPrefix}_testuser`,
      email: `${testPrefix}_test@example.com`,
      password: 'password123',
    });
  });

  afterEach(async () => {
    await cleanupTestData(testPrefix);
  });

  it('allows access with valid access token', async () => {
    // Login to get access token
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({
        username: `${testPrefix}_testuser`,
        password: 'password123',
      });

    const accessToken = loginResponse.body.accessToken;

    // Make authenticated GraphQL request
    const response = await request(app)
      .post('/graphql')
      .set('Cookie', [`access-token=${accessToken}`])
      .send({
        query: '{ me { id username } }',
      })
      .expect(200);

    expect(response.body.data.me).toMatchObject({
      username: `${testPrefix}_testuser`,
    });
  });

  it('rejects request without access token', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ me { id username } }',
      })
      .expect(401);
  });

  it('rejects expired access token', async () => {
    // This would require creating an expired token
    // or mocking time - implementation depends on approach
  });
});
```

### 6. Performance Considerations
- Parallel test execution
- Database connection pooling
- Test execution speed
- CI/CD optimization

### 7. Test Organization
- File naming conventions (`*.int.test.ts`)
- Directory structure (`__tests__` directories)
- Shared test utilities
- Test data factories

### 8. Mocking Strategy for Integration Tests
- What NOT to mock (database, Prisma)
- What TO mock (external APIs, email services)
- Partial mocking strategies

---

## Required Test Utilities

Create these utilities in `test/integration/`:

### `test/integration/database.ts`
```typescript
import { PrismaClient } from '~libs/domain-model/prisma';

const prisma = new PrismaClient();

export const cleanDatabase = async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.localCredentials.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
```

### `test/integration/app.ts`
```typescript
import express from 'express';
import type { Express } from 'express';
import { authEntry } from '~modules/auth/entry';
import { graphqlEntry } from '~modules/graphql/entry';
import { createServer } from 'http';

export const createTestApp = async (): Promise<Express> => {
  const app = express();
  const httpServer = createServer(app);

  const [authModule, graphqlModule] = await Promise.all([
    authEntry(),
    graphqlEntry({ httpServer }),
  ]);

  app.use(authModule.path, authModule.router);
  app.use(graphqlModule.path, graphqlModule.router);

  return app;
};
```


### `test/integration/auth.ts`
```typescript
import { signAccessToken, signRefreshToken } from '~libs/auth-tokens';
import type { User } from '~libs/domain-model';

export const createTestTokens = async (user: User) => {
  const accessToken = await signAccessToken(user);
  const refreshTokenRecord = await RefreshTokenStore.createToken(user);
  const refreshToken = await signRefreshToken(user, refreshTokenRecord);

  return { accessToken, refreshToken };
};
```

---

## Tools and Technologies

### Core Testing
- ✅ **Vitest** - Test framework (v2.1.9, shared with unit tests)
- ✅ **Vitest Integration Config** - Separate config for integration tests (30s timeouts)
- 🔲 **supertest** - HTTP request testing library for both REST and GraphQL (needs installation: `npm install --save-dev supertest @types/supertest`)
- 🔲 **PostgreSQL** - Test database (Docker container recommended)

### Database Management
- ✅ **Prisma** - ORM (real client, no mocking)
- ✅ **Prisma Migrate** - Schema management
- 🔲 **Docker** - Isolated test database container (optional, recommended for CI)

### HTTP/GraphQL Testing
- 🔲 **supertest** - Tests both REST endpoints and GraphQL (POST to /graphql)
- ✅ **Express** - Already in dependencies, used by test app setup

### Utilities
- ✅ Test data factories (user-factory.ts, refresh-token-factory.ts)
- 🔲 Database utilities (createTestPrefix, cleanupTestData)
- 🔲 Test app setup (createTestApp for Express with all modules)
- 🔲 Auth helpers (createTestTokens for generating JWT tokens)

---

## Implementation Timeline

**Current Status**: Ready to begin - Unit testing complete (87 tests passing)

**Prerequisites**:
1. ✅ Unit testing infrastructure complete (Vitest setup, 15 test files)
2. ✅ Team comfortable with Vitest patterns
3. ✅ Test factories established (user, refresh-token factories)
4. 🔲 Test database setup (PostgreSQL test instance)
5. 🔲 Test environment configuration (.env.test)
6. 🔲 Integration test utilities (cleanDatabase, createTestApp, etc.)

**Recommended Implementation Order**:

### Phase 1: Database Store Tests (Week 1) - 8-12 hours
1. Set up test database infrastructure
2. Create database cleanup utilities
3. Test User store functions (3-4 functions)
4. Test RefreshToken store functions (3 functions)
5. Test LocalCredentials store functions (1 function)

### Phase 2: Authentication Tests (Week 2) - 6-8 hours
1. Create test Express app setup
2. Test local credentials login flow
3. Test token refresh flow
4. Test access token validation
5. Test refresh token reuse detection

### Phase 3: GraphQL Tests (Week 2-3) - 6-8 hours
1. Create test Apollo Server setup
2. Test query resolvers with authenticated context
3. Test mutation resolvers
4. Test GraphQL error handling
5. Test authorization checks

### Phase 4: API Endpoint Tests (Week 3) - 4-6 hours
1. Test auth endpoints (login, refresh, logout)
2. Test error responses and validation
3. Test cookie handling
4. Test request/response formatting

### Phase 5: Module System Tests (Week 4) - 2-3 hours
1. Test module mounting and path conflicts
2. Test middleware execution order
3. Test module context passing

**Total Estimated Effort**: 26-37 hours over 4 weeks

---

## Related Documents

- [Testing Strategy Overview](./TESTING_STRATEGY.md) - High-level testing approach
- [Unit Testing Strategy](./UNIT_TESTING_STRATEGY.md) - Pure functions, no I/O
- [E2E Testing Strategy](./E2E_TESTING_STRATEGY.md) - End-to-end testing (browser, full stack)

---

## Next Steps

### Immediate Actions (Week 1)

1. **Install Dependencies**:
   ```bash
   npm install --save-dev supertest @types/supertest
   ```

2. **Set Up Test Database**:
   - Create PostgreSQL test database (Docker recommended)
   - Configure `.env.test` with test database URL
   - Run migrations against test database

3. **Create Test Utilities**:
   - `test/integration/database.ts` - Database cleanup functions
   - `test/integration/app.ts` - Test Express app creation
   - `test/integration/apollo.ts` - Test Apollo Server creation
   - `test/integration/auth.ts` - Test token generation helpers

4. **Add Integration Config**:
   - Create `vitest.integration.config.ts`
   - Update `package.json` test scripts

5. **Implement First Integration Test**:
   - Start with `UserStore.createWithLocalCredentials`
   - Verify setup works end-to-end
   - Use as template for remaining tests

### Ongoing

6. Follow implementation timeline (Phases 1-5)
7. Track progress in checklist below
8. Update documentation as patterns emerge

---

## Implementation Checklist

### Database Store Tests
- [ ] User store (create, get, rotate-token-version)
- [ ] RefreshToken store (create, find-youngest, clear-family)
- [ ] LocalCredentials store (get-with-user)

### Authentication Tests
- [ ] Local credentials login flow
- [ ] Token refresh flow
- [ ] Access token validation
- [ ] Refresh token reuse detection
- [ ] Password hashing verification

### GraphQL Tests
- [ ] Query resolvers (me, user)
- [ ] Mutation resolvers
- [ ] Error handling (NotFoundError, BadInputError)
- [ ] Authorization checks

### API Endpoint Tests
- [ ] POST /auth/login/local
- [ ] POST /auth/refresh
- [ ] POST /auth/logout
- [ ] POST /graphql (with auth)

### Module System Tests
- [ ] Module mounting and path uniqueness
- [ ] Middleware execution order
- [ ] Module context passing

---

**Document Owner**: Engineering Team Lead
**Created**: 2026-02-21
**Last Updated**: 2026-02-22
**Status**: Ready for Implementation
