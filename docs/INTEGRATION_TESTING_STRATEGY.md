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

**Test Database Management** (Schema-based isolation for parallel execution):

**Approach**: Each Vitest worker gets its own PostgreSQL schema for complete isolation

**How it works:**
- One PostgreSQL database, multiple schemas (like namespaces)
- Each worker creates its own schema: `test_worker_1`, `test_worker_2`, etc.
- Migrations run once per schema when worker starts
- Tests within a worker clean data between tests
- Workers are completely isolated from each other

```typescript
// test/integration/database.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

/**
 * Get unique schema name for this worker
 */
const getWorkerSchema = (): string => {
  const workerId = process.env.VITEST_POOL_ID || '1';
  return `test_worker_${workerId}`;
};

/**
 * Create Prisma client configured for worker's schema
 */
export const createTestPrismaClient = async () => {
  const schema = getWorkerSchema();

  // Create schema if it doesn't exist
  const tempPrisma = new PrismaClient();
  await tempPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await tempPrisma.$disconnect();

  // Create client with schema in connection URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}?schema=${schema}`,
      },
    },
  });

  return { prisma, schema };
};

/**
 * Run Prisma migrations on worker's schema
 * Called once when worker starts (global setup)
 */
export const setupWorkerDatabase = async () => {
  const schema = getWorkerSchema();

  // Set schema in environment for migration
  const originalUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = `${originalUrl}?schema=${schema}`;

  // Run Prisma migrations
  execSync(
    'npx prisma migrate deploy --schema=./src/libs/domain-model/prisma/schema.prisma',
    { stdio: 'inherit' }
  );

  // Restore original URL
  process.env.DATABASE_URL = originalUrl;
};

/**
 * Clean all data in worker's schema
 * Called in beforeEach to reset state between tests
 */
export const cleanWorkerDatabase = async (prisma: PrismaClient) => {
  // Delete in order to respect foreign key constraints
  await prisma.refreshToken.deleteMany();
  await prisma.localCredentials.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
};

/**
 * Drop worker's schema
 * Called once when worker shuts down (global teardown)
 */
export const teardownWorkerDatabase = async () => {
  const schema = getWorkerSchema();
  const prisma = new PrismaClient();
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await prisma.$disconnect();
};
```

**Vitest Integration Config** (`vitest.integration.config.ts`):
```typescript
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths({ loose: true })],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.int.test.ts'],

    // Enable parallel execution with multiple workers
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4,  // 4 workers = 4 database schemas
      },
    },

    // Global setup/teardown runs once per worker
    globalSetup: './test/integration/global-setup.ts',

    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
```

**Global Setup** (`test/integration/global-setup.ts`):
```typescript
import { setupWorkerDatabase, teardownWorkerDatabase } from './database';

export async function setup() {
  console.log(`Setting up schema for worker ${process.env.VITEST_POOL_ID}`);
  await setupWorkerDatabase();
}

export async function teardown() {
  console.log(`Tearing down schema for worker ${process.env.VITEST_POOL_ID}`);
  await teardownWorkerDatabase();
}
```

### 2. Data Seeding and Cleanup

**Approach**: Schema-based isolation with simple cleanup between tests

**Test Pattern**:
```typescript
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { createTestPrismaClient, cleanWorkerDatabase } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';
import type { PrismaClient } from '@prisma/client';

describe('UserStore.createWithLocalCredentials (integration)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Get Prisma client for this worker's schema
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;
  });

  beforeEach(async () => {
    // Clean all data in worker schema before each test
    await cleanWorkerDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates user and credentials in transaction', async () => {
    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe('testuser');
    }
  });

  it('returns USERNAME_EXISTS for duplicate username', async () => {
    // First creation
    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test1@example.com',
      password: 'password123',
    });

    // Duplicate creation
    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',  // Same username
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

**Why This Approach?**
- ✅ **True parallel execution** - Each worker completely isolated in separate schema
- ✅ **Simple test code** - No unique prefixes, clean usernames/emails
- ✅ **Fast** - Tests run in parallel across multiple workers
- ✅ **One database** - Multiple schemas, not multiple databases
- ✅ **Complete isolation** - Workers cannot interfere with each other
- ✅ **Easy debugging** - Can inspect data in specific worker schema

**How Parallel Execution Works:**
- Vitest creates 4 workers (configurable via `maxThreads`)
- Each worker gets schema: `test_worker_1`, `test_worker_2`, etc.
- Migrations run once per worker on startup
- Tests within same worker run sequentially, cleaning DB between each
- Tests across different workers run in parallel with no conflicts

### 3. Prisma Testing Patterns

**Key Principle**: Use REAL Prisma client - never mock the database

**Testing CRUD Operations**:
```typescript
describe('UserStore.getById (integration)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;
  });

  beforeEach(async () => {
    await cleanWorkerDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns user when found', async () => {
    // Arrange: Create test data
    const createResult = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
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
        username: 'testuser',
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
    username: 'testuser',
    email: 'test1@example.com',
    password: 'password123',
  });

  // Act: Try to create duplicate username
  const result = await UserStore.createWithLocalCredentials({
    username: 'testuser',  // Same username
    email: 'test2@example.com',  // Different email
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
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { createTestApp } from '#test/integration/app';
import { createTestPrismaClient, cleanWorkerDatabase } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';
import type { PrismaClient } from '@prisma/client';
import type { Express } from 'express';

describe('GraphQL me query (integration)', () => {
  let app: Express;
  let prisma: PrismaClient;
  let accessToken: string;

  beforeAll(async () => {
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;
    app = await createTestApp();
  });

  beforeEach(async () => {
    await cleanWorkerDatabase(prisma);

    // Create test user
    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    // Login to get access token
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
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
      username: 'testuser',
      email: 'test@example.com',
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
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { createTestApp } from '#test/integration/app';
import { createTestPrismaClient, cleanWorkerDatabase } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';
import type { PrismaClient } from '@prisma/client';
import type { Express } from 'express';

describe('POST /auth/login/local (integration)', () => {
  let app: Express;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;
    app = await createTestApp();
  });

  beforeEach(async () => {
    await cleanWorkerDatabase(prisma);

    // Create test user
    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns tokens with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({
        username: 'testuser',
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
        username: 'testuser',
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
        username: 'nonexistent',
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
  let prisma: PrismaClient;

  beforeAll(async () => {
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;
    app = await createTestApp();
  });

  beforeEach(async () => {
    await cleanWorkerDatabase(prisma);

    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('issues new tokens with valid refresh token', async () => {
    // Login to get initial tokens
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({
        username: 'testuser',
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
        username: 'testuser',
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
  let prisma: PrismaClient;

  beforeAll(async () => {
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;
    app = await createTestApp();
  });

  beforeEach(async () => {
    await cleanWorkerDatabase(prisma);

    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('allows access with valid access token', async () => {
    // Login to get access token
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({
        username: 'testuser',
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
      username: 'testuser',
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

See "Test Database Setup" section above for full implementation including:
- `getWorkerSchema()` - Get schema name for current worker
- `createTestPrismaClient()` - Create Prisma client for worker schema
- `setupWorkerDatabase()` - Run migrations on worker schema (global setup)
- `cleanWorkerDatabase(prisma)` - Delete all data in schema (beforeEach)
- `teardownWorkerDatabase()` - Drop worker schema (global teardown)

### `test/integration/global-setup.ts`
```typescript
import { setupWorkerDatabase, teardownWorkerDatabase } from './database';

export async function setup() {
  console.log(`Setting up schema for worker ${process.env.VITEST_POOL_ID}`);
  await setupWorkerDatabase();
}

export async function teardown() {
  console.log(`Tearing down schema for worker ${process.env.VITEST_POOL_ID}`);
  await teardownWorkerDatabase();
}
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
- 🔲 Database utilities (createTestPrismaClient, cleanWorkerDatabase, setupWorkerDatabase)
- 🔲 Global setup (test/integration/global-setup.ts for schema lifecycle)
- 🔲 Test app setup (createTestApp for Express with all modules)
- 🔲 Auth helpers (optional - can just login via HTTP in tests)

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
