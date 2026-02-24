# Integration Testing Strategy

**Version**: 1.1
**Last Updated**: 2026-02-24
**Status**: Infrastructure complete — tests being added
**Parent Document**: [Testing Strategy Overview](./TESTING_STRATEGY.md)

---

## What Integration Tests Cover

Integration tests verify that multiple units work correctly together with real external dependencies (database, HTTP server, GraphQL execution). They complement unit tests by catching issues that only appear when components interact.

**Store Functions** (`src/libs/domain-model/stores/**`) — Real Prisma client against a real PostgreSQL database. This catches constraint violations, transaction rollbacks, and query edge cases that mocks cannot reproduce.

**Authentication Flows** (`src/modules/auth/routes/**`) — Full HTTP request/response cycle including Passport.js strategy execution, JWT signing, cookie setting, and session management.

**GraphQL Resolvers** (`src/modules/graphql/resolvers/**`) — End-to-end resolver execution through the HTTP stack, including authentication middleware and data transformations. Tested via HTTP rather than `executeOperation()` so the full middleware chain runs.

**API Route Handlers** — Express routing, request validation, response formatting, and error handling.

---

## File Naming and Organization

Integration tests use `*.int.test.ts` naming and live alongside unit tests in `__tests__` directories. This separates them from unit tests (`*.test.ts`) so they can be run independently — unit tests don't need a database, integration tests do.

```
src/libs/domain-model/stores/user/
├── __tests__/
│   ├── create-with-local-credentials.test.ts     # Unit test
│   └── create-with-local-credentials.int.test.ts # Integration test
├── create-with-local-credentials.ts
└── index.ts
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

### Supertest for GraphQL

GraphQL endpoints are tested via HTTP with supertest, not with `executeOperation()`. This tests the complete stack including authentication middleware, which is the behaviour clients actually experience.

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

### Database Store Tests
- [ ] User store (create, get, rotate-token-version)
- [ ] RefreshToken store (create, find-youngest, clear-family)
- [ ] LocalCredentials store (get-with-user)

### Authentication Tests
- [ ] Local credentials login flow
- [ ] Token refresh flow
- [ ] Access token validation
- [ ] Refresh token reuse detection

### GraphQL Tests
- [ ] Query resolvers (me, user)
- [ ] Mutation resolvers
- [ ] Error handling (NotFoundError, BadInputError)
- [ ] Authorization checks

### API Endpoint Tests
- [ ] POST /auth/login/local
- [ ] POST /auth/refresh
- [ ] POST /auth/logout

---

## Related Documents

- [Testing Strategy Overview](./TESTING_STRATEGY.md)
- [Unit Testing Strategy](./UNIT_TESTING_STRATEGY.md)
- [E2E Testing Strategy](./E2E_TESTING_STRATEGY.md)
- [Integration Test Infrastructure](../test/integration/README.md)
