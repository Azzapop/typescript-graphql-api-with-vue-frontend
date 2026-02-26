# Test Infrastructure

This directory contains utilities for running tests with real database connections. Used by both **unit tests** (lib functions that touch the DB, like store functions) and **integration tests** (full module API tests via HTTP).

## Architecture

### Sequential Execution with Schema Isolation

Tests run sequentially in a single process against a dedicated PostgreSQL schema (`test_schema`). This was chosen over parallel execution because the current test count runs fast enough that the simplicity of sequential testing outweighs the coordination overhead of parallel schemas. When tests grow beyond ~200, parallel schema-per-worker execution becomes worthwhile — see Future Improvements below.

Using a dedicated schema rather than a separate database keeps setup simple: no separate database instance or user permissions are required, and the test schema lives alongside the development database.

### Why TRUNCATE CASCADE instead of DELETE

`TRUNCATE` resets auto-increment sequences and removes all rows atomically, whereas `DELETE` leaves sequences in their post-insert state. Sequence reset ensures tests cannot accidentally assert on ID values that were influenced by prior test runs. CASCADE handles foreign key ordering automatically, removing the need to specify a deletion order.

### Test App Setup (Integration Tests Only)

The test app mounts only the auth and GraphQL modules — the client (SSR) module is excluded because integration tests target the API layer. This keeps test startup fast and focused. Unit tests that need the database use the Prisma client directly without the Express app.

## Test Lifecycle

1. **Global Setup** — Creates `test_schema` if it doesn't exist, then runs Prisma migrations. Runs once before all tests.
2. **Test Execution** — Tests run sequentially. `beforeEach` truncates all tables, giving each test a clean slate.
3. **Global Teardown** — Drops `test_schema` completely. Runs once after all tests.

## Utilities

- **`createTestPrismaClient()`** — Creates a Prisma client scoped to the test schema.
- **`setupWorkerDatabase()`** — Creates the schema and runs migrations. Used in global setup.
- **`cleanWorkerDatabase(prisma)`** — TRUNCATEs all tables with CASCADE. Used in `beforeEach`.
- **`teardownWorkerDatabase()`** — Drops the test schema. Used in global teardown.
- **`createTestApp()`** — Creates an Express app with auth and GraphQL modules for HTTP testing with supertest.

## Running Tests

```bash
# Unit tests (includes repository tests that use the DB)
npm run test:unit
npm run test:unit:watch

# Integration tests (full module API tests via HTTP)
npm run test:integration
npm run test:integration:watch

# All tests
npm run test:all
```

## Prerequisites

1. PostgreSQL running with `test_financial_planner_local_db` database created
2. Database user with schema creation permissions
3. `.env.test` configured with correct `DATABASE_URL`

## Debugging

If tests are interrupted mid-run, `test_schema` may remain in the database. Re-running tests will handle this correctly — the global setup uses `CREATE SCHEMA IF NOT EXISTS` and Prisma migrations are idempotent.

To inspect state during development, connect to the test database and query `test_schema.*` tables directly.

## Best Practices

- Call `cleanWorkerDatabase()` in `beforeEach`, not `beforeAll` — every test must start with empty tables, not just the first one in each suite.
- Always disconnect Prisma in `afterAll` to prevent open handles from blocking test completion.
- Don't rely on test execution order. Sequential ≠ dependent.

## Future: Parallel Execution

When test count grows significantly, each Vitest worker can be given its own schema (`test_worker_1`, `test_worker_2`, etc.), with migrations running once per worker on startup. TRUNCATE CASCADE still handles per-test cleanup within each worker. The infrastructure supports this with minimal changes to the Vitest config.
