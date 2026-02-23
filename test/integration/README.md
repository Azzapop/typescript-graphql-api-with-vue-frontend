# Integration Test Infrastructure

This directory contains utilities for running integration tests with real database connections.

## Architecture

### Schema-Based Isolation

Each Vitest worker gets its own PostgreSQL schema for complete test isolation:

- Worker 1: `test_worker_1`
- Worker 2: `test_worker_2`
- Worker 3: `test_worker_3`
- Worker 4: `test_worker_4`

This enables:
- True parallel test execution (4 workers by default)
- Complete isolation between test files
- No conflicts or race conditions
- Easy debugging (can inspect specific worker schemas)

### Worker Lifecycle

1. **Global Setup** (`global-setup.ts`):
   - Runs once when worker starts
   - Creates worker's schema
   - Runs Prisma migrations

2. **Test Execution**:
   - Tests run sequentially within worker
   - `beforeEach` cleans database between tests
   - Each test starts with empty database

3. **Global Teardown** (`global-setup.ts`):
   - Runs once when worker shuts down
   - Drops worker's schema

## Utilities

### `database.ts`

Database management utilities:

- `createTestPrismaClient()` - Create Prisma client for worker's schema
- `setupWorkerDatabase()` - Run migrations on worker's schema (global setup)
- `cleanWorkerDatabase(prisma)` - Delete all data (beforeEach hook)
- `teardownWorkerDatabase()` - Drop worker's schema (global teardown)

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
    await cleanWorkerDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should test something', async () => {
    // Test implementation
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
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_db"
JWT_ACCESS_SECRET="test-access-secret-min-32-chars-long-for-jwt"
JWT_REFRESH_SECRET="test-refresh-secret-min-32-chars-long-for-jwt"
NODE_ENV="test"
LOG_LEVEL="error"
```

### Vitest Config (`vitest.integration.config.ts`)

- Includes: `src/**/*.int.test.ts`
- Workers: 4 parallel threads
- Timeouts: 30 seconds
- Global setup: `test/integration/global-setup.ts`

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
2. Test database created: `test_db`
3. Database user with schema creation permissions
4. `.env.test` configured with correct DATABASE_URL

## Debugging

### View Worker Schemas

```sql
-- Connect to test database
psql -d test_db

-- List all schemas
\dn

-- View tables in worker schema
\dt test_worker_1.*

-- Query data in worker schema
SELECT * FROM test_worker_1."User";
```

### Clean Up Orphaned Schemas

If tests are interrupted, schemas may not be cleaned up:

```sql
DROP SCHEMA IF EXISTS test_worker_1 CASCADE;
DROP SCHEMA IF EXISTS test_worker_2 CASCADE;
DROP SCHEMA IF EXISTS test_worker_3 CASCADE;
DROP SCHEMA IF EXISTS test_worker_4 CASCADE;
```

## Best Practices

1. Always use `beforeEach` to clean database
2. Always disconnect Prisma client in `afterAll`
3. Use test factories for creating test data
4. Keep tests focused and independent
5. Test both success and error cases
6. Verify database state after operations

## Related Documentation

- [Integration Testing Strategy](../../docs/INTEGRATION_TESTING_STRATEGY.md)
- [Unit Testing Strategy](../../docs/UNIT_TESTING_STRATEGY.md)
