# Integration Test Infrastructure

This directory contains utilities for running integration tests with real database connections.

## Architecture

### Schema-Based Isolation with Sequential Execution

Tests use a dedicated PostgreSQL schema (`test_schema`) with sequential execution:

- **Single schema**: `test_schema`
- **Sequential execution**: Tests run one at a time (single fork)
- **Complete cleanup**: TRUNCATE CASCADE between each test
- **Simple and reliable**: No race conditions or parallel complexity

This enables:
- Complete isolation between tests
- Predictable test execution order
- Simple debugging
- Fast enough for current test count (~10 seconds for 89 tests)

### Test Lifecycle

1. **Global Setup** (`global-setup.ts`):
   - Runs once before all tests
   - Creates `test_schema` if it doesn't exist
   - Runs Prisma migrations

2. **Test Execution**:
   - Tests run sequentially (one at a time)
   - `beforeEach` uses TRUNCATE CASCADE to reset all tables
   - Each test starts with completely empty tables
   - Auto-increment sequences are reset

3. **Global Teardown** (`global-setup.ts`):
   - Runs once after all tests
   - Drops `test_schema` completely

## Utilities

### `database.ts`

Database management utilities:

- **`createTestPrismaClient()`** - Create Prisma client configured for test schema
- **`setupWorkerDatabase()`** - Create schema and run migrations (global setup)
- **`cleanWorkerDatabase(prisma)`** - TRUNCATE all tables with CASCADE (beforeEach)
- **`teardownWorkerDatabase()`** - Drop test schema (global teardown)

#### TRUNCATE CASCADE Cleanup

Complete database cleanup between tests:

```typescript
export const cleanWorkerDatabase = async (prisma: PrismaClient): Promise<void> => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "LocalCredentials" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "UserProfile" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');
};
```

Benefits:
- ⚡ Faster than DELETE for removing all rows
- 🔄 Resets auto-increment sequences
- 🔗 Automatic cascade handling
- ✨ Complete cleanup ensures true isolation

### `app.ts`

Test Express app creation:

- `createTestApp()` - Create Express app with auth + GraphQL modules mounted
- Used for supertest HTTP testing
- Does NOT mount client module (not needed for API tests)

## Usage

### Basic Test Pattern

```typescript
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import {
  cleanWorkerDatabase,
  createTestPrismaClient,
} from '#test/integration/database';

describe('My Integration Test', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;
  });

  beforeEach(async () => {
    // Complete cleanup - TRUNCATE CASCADE resets everything
    await cleanWorkerDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should test something', async () => {
    // Test implementation - starts with clean database
  });
});
```

### HTTP Testing Pattern

```typescript
import request from 'supertest';
import { createTestApp } from '#test/integration/app';

describe('API Integration Test', () => {
  let app: Express;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const { prisma: workerPrisma } = await createTestPrismaClient();
    prisma = workerPrisma;
    app = await createTestApp();
  });

  beforeEach(async () => {
    await cleanWorkerDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should test API endpoint', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({ username: 'test', password: 'pass' })
      .expect(200);

    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
    });
  });
});
```

## Configuration

### Environment Variables (`.env.test`)

```bash
DATABASE_URL="postgresql://financial_planner_local@localhost:5432/test_financial_planner_local_db"
JWT_ACCESS_SECRET="test-access-secret-min-32-chars-long-for-jwt"
JWT_REFRESH_SECRET="test-refresh-secret-min-32-chars-long-for-jwt"
NODE_ENV="test"
LOG_LEVEL="error"
```

**Note**: The `DATABASE_URL` is automatically appended with `?schema=test_schema` by the test configuration.

### Vitest Config (`vitest.integration.config.ts`)

```typescript
export default defineConfig({
  test: {
    include: ['src/**/*.int.test.ts'],

    // Sequential execution in single process
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,  // All tests in one process, one at a time
      },
    },

    // Global setup/teardown runs once before/after all tests
    globalSetup: './test/integration/global-setup.ts',

    // Integration tests may need longer timeouts
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
```

## Running Tests

```bash
# Run all integration tests
npm run test:integration

# Run in watch mode
npm run test:integration:watch

# Run with verbose output
npm run test:integration -- --reporter=verbose

# Run specific test file
npm run test:integration -- src/libs/domain-model/stores/user/__tests__/create.int.test.ts
```

## Prerequisites

1. PostgreSQL database running
2. Test database created: `test_financial_planner_local_db`
3. Database user with schema creation permissions
4. `.env.test` configured with correct DATABASE_URL

## Debugging

### View Test Schema

```sql
-- Connect to test database
psql -d test_financial_planner_local_db

-- List all schemas
\dn

-- View tables in test schema
\dt test_schema.*

-- Query data in test schema
SELECT * FROM test_schema."User";
```

### Clean Up Test Schema

If tests are interrupted, the schema may remain:

```sql
DROP SCHEMA IF EXISTS test_schema CASCADE;
```

Or run:
```bash
npm run test:integration
```
The global setup will recreate the schema automatically.

## Best Practices

1. **Always use `beforeEach`** to clean database with `cleanWorkerDatabase()`
2. **Always disconnect** Prisma client in `afterAll`
3. **Use test factories** for creating test data consistently
4. **Keep tests independent** - each test should work in isolation
5. **Test both success and error cases** - comprehensive coverage
6. **Verify database state** after operations to ensure data integrity
7. **Don't rely on test order** - sequential ≠ dependencies

## Future Improvements

When test count grows significantly (>200 tests):

1. **Enable parallel execution** by creating multiple schemas (test_worker_1, test_worker_2, etc.)
2. **Update** `vitest.integration.config.ts` to remove `singleFork: true`
3. **Modify** `database.ts` to use worker-specific schemas
4. **Keep** TRUNCATE CASCADE approach for cleanup

This will provide ~4x speedup with minimal code changes.

## Related Documentation

- [Integration Testing Strategy](../../docs/INTEGRATION_TESTING_STRATEGY.md)
- [Unit Testing Strategy](../../docs/UNIT_TESTING_STRATEGY.md)
