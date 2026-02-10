# Testing Strategy

## Overview

This document outlines the testing approach for the codebase, distinguishing between **libs** (isolated packages) and **modules** (deployable applications).

## File Naming Convention

| Test Type | Pattern | Description |
|-----------|---------|-------------|
| Unit | `*.test.ts` | Isolated tests, no external dependencies |
| Integration | `*.int.test.ts` | Requires database connection |
| E2E | `*.e2e.test.ts` | Requires running server and database |

## Directory Structure

Tests live alongside the code they test in a `__tests__` directory:

```
src/
├── libs/
│   └── example-lib/
│       ├── __tests__/
│       │   ├── some-function.test.ts
│       │   └── database-stuff.int.test.ts
│       ├── some-function.ts
│       └── index.ts
├── modules/
│   └── auth/
│       ├── __tests__/
│       │   └── login.e2e.test.ts
│       └── routes/
└── test/
    ├── setup.ts        # Global test setup
    ├── db.ts           # Test database helpers
    └── server.ts       # Test server helpers
```

## Libs

Libs are isolated packages with minimal external dependencies. Most libs only need **unit tests**.

### Unit Tests (most libs)

| Lib | Test Focus |
|-----|------------|
| `trace-token` | UUID generation, header constant |
| `trace-context` | AsyncLocalStorage wrapper behavior |
| `logger` | Output formatting (mock console) |
| `graphql-transformers` | Data transformation logic |
| `graphql-validators` | Validation rules |
| `graphql-errors` | Error creation and formatting |
| `auth-tokens` | JWT signing/verification (mock secrets) |
| `auth-middleware` | Passport strategy behavior (mock req/res) |
| `async-handler` | Error propagation in async handlers |

### No Tests Required

| Lib | Reason |
|-----|--------|
| `helper-types` | Type-only, TypeScript compiler validates |
| `graphql-types` | Generated code |
| `prisma-validators` | Generated code |
| `vite` | Configuration only |
| `client-utils` | Thin wrappers, tested via e2e |

### Integration Tests (exception)

| Lib | Test Focus |
|-----|------------|
| `domain-model` | Prisma queries against test database |

## Modules

Modules are deployable applications. They should have **more e2e tests than unit tests** since:
- Business logic lives in libs
- Modules primarily wire things together
- E2E tests catch integration issues

### Auth Module

```
modules/auth/__tests__/
├── login.e2e.test.ts      # POST /auth/login/local
├── logout.e2e.test.ts     # DELETE /auth/logout
└── refresh.e2e.test.ts    # POST /auth/refresh
```

**Test scenarios:**
- Valid credentials → tokens set in cookies
- Invalid credentials → 401 response
- Missing fields → 400 validation error
- Token refresh flow
- Logout clears cookies

### GraphQL Module

```
modules/graphql/__tests__/
├── painters.e2e.test.ts
├── paintings.e2e.test.ts
└── mutations.e2e.test.ts
```

**Test scenarios:**
- Query returns expected data
- Mutations create/update records
- Validation errors handled
- Authentication required (when implemented)

### Client Module

```
modules/client/__tests__/
├── components/           # Component unit tests (Vitest)
│   └── Button.test.ts
└── e2e/                  # Browser tests (Playwright)
    ├── login.e2e.test.ts
    └── navigation.e2e.test.ts
```

## Test Utilities

### `test/setup.ts`
Global test configuration, runs before all tests.

### `test/db.ts`
Database helpers for integration/e2e tests:
- `resetDatabase()` - Clear and reseed test data
- `seedTestData()` - Insert known test fixtures
- `getTestPrisma()` - Get Prisma client for test DB

### `test/server.ts`
Server helpers for e2e tests:
- `startTestServer()` - Start server on random port
- `stopTestServer()` - Cleanup after tests
- `getTestClient()` - HTTP client configured for test server

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm test -- --testPathPattern='\.test\.ts$' --testPathIgnorePatterns='\.int\.test\.ts$|\.e2e\.test\.ts$'

# Integration tests only
npm test -- --testPathPattern='\.int\.test\.ts$'

# E2E tests only
npm test -- --testPathPattern='\.e2e\.test\.ts$'

# Specific lib
npm test -- src/libs/graphql-transformers

# Watch mode
npm test -- --watch
```

## CI Pipeline

1. **Unit tests** - Run on every PR, fast feedback
2. **Integration tests** - Run on every PR, requires test DB
3. **E2E tests** - Run on merge to main, full server + DB

## Guidelines

1. **Test behavior, not implementation** - Tests should not break when refactoring internals
2. **One assertion per test** - Makes failures easy to diagnose
3. **Descriptive test names** - `it('returns error when painter name is empty')` not `it('test1')`
4. **Arrange-Act-Assert** - Clear structure in each test
5. **No test interdependence** - Tests must run in any order
6. **Mock external dependencies** - APIs, filesystem, etc.
7. **Use real database for integration** - Don't mock Prisma
