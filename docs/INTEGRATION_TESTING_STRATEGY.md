# Integration Testing Strategy

**Version**: 2.0
**Last Updated**: 2026-02-25
**Status**: Infrastructure complete — tests being added
**Parent Document**: [Testing Strategy Overview](./TESTING_STRATEGY.md)

---

## What Integration Tests Cover

Integration tests are **full tests of modules that expose APIs**. They exercise the complete HTTP stack — routing, middleware, authentication, stores, and database — via supertest. They verify the API contract that clients actually consume.

**Auth Module** (`src/modules/auth/`) — Full HTTP request/response cycle for authentication endpoints. Login, token refresh, logout, including Passport.js strategy execution, JWT signing, cookie setting, and response formatting.

**GraphQL Module** (`src/modules/graphql/`) — End-to-end query and mutation execution through the HTTP stack, including authentication middleware and data transformations. Tested via HTTP with supertest so the full middleware chain runs.

### What Integration Tests Do NOT Cover

- **Individual lib functions** — Those are unit tests. Store functions, transformers, token logic, etc. are tested directly as unit tests.
- **Frontend user flows** — Those are E2E tests. Browser-based interactions are not covered here.

---

## File Naming and Organization

Integration tests use `*.int.test.ts` naming and live in `__tests__` directories within the module being tested. This separates them from unit tests (`*.test.ts`) so they can be run independently.

```
src/modules/auth/
├── __tests__/
│   ├── login-local.int.test.ts     # POST /auth/login/local
│   ├── refresh.int.test.ts         # POST /auth/refresh
│   └── logout.int.test.ts          # POST /auth/logout
├── entry.ts
└── routes/
```

```
src/modules/graphql/
├── __tests__/
│   ├── me-query.int.test.ts        # { me { ... } }
│   └── auth-rejection.int.test.ts  # Unauthenticated requests
├── entry.ts
└── resolvers/
```

---

## Infrastructure

### Sequential Execution with Schema Isolation

Tests run sequentially in a single process against a dedicated PostgreSQL schema (`test_schema`). Schema isolation means tests don't share state with development data and the schema can be torn down completely after each run.

Sequential execution was chosen over parallel (schema-per-worker) because the current test volume doesn't justify the added complexity. When tests grow beyond ~200, parallel execution becomes worthwhile — see the integration test README for details.

### Database Cleanup Strategy

`TRUNCATE CASCADE` is used between tests rather than `DELETE`. TRUNCATE resets auto-increment sequences and removes all rows atomically, so tests cannot accidentally depend on ID values from previous runs. CASCADE handles foreign key ordering automatically.

### Test App

A minimal Express app is created for HTTP testing, mounting only the auth and GraphQL modules. The SSR client module is excluded — integration tests target the API layer. This keeps test startup fast.

### Supertest for All Endpoints

All endpoints are tested via HTTP with supertest. This tests the complete stack including routing, middleware, authentication, and response formatting — which is the behaviour clients actually experience.

---

## Tools

- **Vitest** — Test framework with separate integration config (`vitest.integration.config.ts`)
- **supertest** — HTTP testing for both REST and GraphQL endpoints
- **Prisma** — Real client, never mocked
- **PostgreSQL** — Real database, dedicated test schema

---

## Test Scripts

```bash
npm run test:integration        # Run all integration tests
npm run test:integration:watch  # Watch mode
npm run test:all                # Unit tests + integration tests
```

---

## Implementation Checklist

### Auth Module Endpoints
- [ ] POST /auth/login/local — successful login, invalid credentials, missing fields
- [ ] POST /auth/refresh — valid refresh, expired token, reuse detection
- [ ] POST /auth/logout — successful logout, unauthenticated request

### GraphQL Module Endpoints
- [ ] Authenticated queries (me, user profile)
- [ ] Authenticated mutations
- [ ] Unauthenticated rejection (401)
- [ ] Error handling (NotFoundError, BadInputError responses)

---

## Related Documents

- [Testing Strategy Overview](./TESTING_STRATEGY.md)
- [Unit Testing Strategy](./UNIT_TESTING_STRATEGY.md)
- [E2E Testing Strategy](./E2E_TESTING_STRATEGY.md)
- [Integration Test Infrastructure](../test/integration/README.md)
