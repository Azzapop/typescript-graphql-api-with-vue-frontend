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

**Convention**: Integration tests use `*.integration.test.ts` naming

```
src/libs/domain-model/stores/user/
├── __tests__/
│   ├── create-with-local-credentials.test.ts           # Unit test (if pure logic exists)
│   └── create-with-local-credentials.integration.test.ts  # Integration test with DB
├── create-with-local-credentials.ts
└── index.ts
```

**Separation**:
- Unit tests: `*.test.ts` - Run by default with `npm test` or `npm run test:unit`
- Integration tests: `*.integration.test.ts` - Run with `npm run test:integration`

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

**Test Database Management**:
```typescript
// test/integration/database.ts
import { PrismaClient } from '~libs/domain-model/prisma';

const prisma = new PrismaClient();

export const cleanDatabase = async () => {
  // Delete in order to respect foreign key constraints
  await prisma.refreshToken.deleteMany();
  await prisma.localCredentials.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
```

**Vitest Integration Config** (`vitest.integration.config.ts`):
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
    testTimeout: 30000,  // Longer for DB operations
    hookTimeout: 30000,
  },
});
```

### 2. Data Seeding and Cleanup

**Approach**: Clean database before each test, use factories for test data

**Test Pattern**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { cleanDatabase } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';

describe('UserStore.createWithLocalCredentials (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();  // Fresh state for each test
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
});
```

**Why Not Transaction Rollback?**
- Simpler to understand (explicit cleanup)
- Works with all test scenarios
- No transaction nesting issues
- Clear database state between tests

### 3. Prisma Testing Patterns

**Key Principle**: Use REAL Prisma client - never mock the database

**Testing CRUD Operations**:
```typescript
describe('UserStore.getById (integration)', () => {
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

**Strategy**: Test resolvers with real database and authenticated context

**Test Setup**:
```typescript
// test/integration/apollo.ts
import { ApolloServer } from '@apollo/server';
import { typeDefs } from '~modules/graphql/type-defs';
import { resolvers } from '~modules/graphql/resolvers';

export const createTestApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};
```

**Testing Queries**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestApolloServer } from '#test/integration/apollo';
import { cleanDatabase } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';
import type { GraphQLContext } from '~modules/graphql/graphql-context';

describe('GraphQL me query (integration)', () => {
  let apolloServer: ApolloServer;
  let testUser: User;

  beforeEach(async () => {
    await cleanDatabase();
    apolloServer = createTestApolloServer();

    // Create test user
    const result = await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    testUser = result.data;
  });

  it('returns current user profile when authenticated', async () => {
    const response = await apolloServer.executeOperation(
      {
        query: `
          query {
            me {
              id
              username
              email
            }
          }
        `,
      },
      {
        contextValue: { user: testUser } as GraphQLContext,
      }
    );

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.data?.me).toMatchObject({
        id: testUser.id,
        username: 'testuser',
        email: 'test@example.com',
      });
    }
  });
});
```

**Testing Mutations**:
```typescript
it('creates resource with valid input', async () => {
  const response = await apolloServer.executeOperation(
    {
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
    },
    {
      contextValue: { user: testUser },
    }
  );

  expect(response.body.kind).toBe('single');
  // Verify data in database
});
```

**Testing GraphQL Errors**:
```typescript
it('returns NOT_FOUND error for non-existent resource', async () => {
  const response = await apolloServer.executeOperation(
    {
      query: `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            username
          }
        }
      `,
      variables: { id: 'non-existent-id' },
    },
    { contextValue: { user: testUser } }
  );

  expect(response.body.kind).toBe('single');
  if (response.body.kind === 'single') {
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.errors?.[0].extensions?.code).toBe('NOT_FOUND');
  }
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
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestApp } from '#test/integration/app';
import { cleanDatabase } from '#test/integration/database';
import { UserStore } from '~libs/domain-model/stores/user';

describe('POST /auth/login/local (integration)', () => {
  let app: Express;

  beforeEach(async () => {
    await cleanDatabase();
    app = await createTestApp();

    // Create test user
    await UserStore.createWithLocalCredentials({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
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
  it('issues new tokens with valid refresh token', async () => {
    // Login to get initial tokens
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({ username: 'testuser', password: 'password123' });

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
      .send({ username: 'testuser', password: 'password123' });

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
  it('allows access with valid access token', async () => {
    // Login to get access token
    const loginResponse = await request(app)
      .post('/auth/login/local')
      .send({ username: 'testuser', password: 'password123' });

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
- File naming conventions (`*.integration.test.ts`)
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

### `test/integration/apollo.ts`
```typescript
import { ApolloServer } from '@apollo/server';
import { typeDefs } from '~modules/graphql/type-defs';
import { resolvers } from '~modules/graphql/resolvers';

export const createTestApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
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
- 🔲 **supertest** - HTTP request testing library (needs installation)
- 🔲 **PostgreSQL** - Test database (Docker container recommended)

### Database Management
- ✅ **Prisma** - ORM (real client, no mocking)
- ✅ **Prisma Migrate** - Schema management
- 🔲 **Docker** - Isolated test database container

### GraphQL Testing
- ✅ **Apollo Server** - GraphQL server (already in dependencies)
- ✅ **@apollo/client** - GraphQL client (already in dependencies)

### Utilities
- ✅ Test data factories (user-factory.ts, refresh-token-factory.ts)
- 🔲 Database cleanup utilities (to be created)
- 🔲 Test app setup utilities (to be created)
- 🔲 Test Apollo server setup (to be created)

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
