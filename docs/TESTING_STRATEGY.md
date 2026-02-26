# Testing Strategy Overview

**Version**: 1.0
**Last Updated**: 2026-02-21
**Status**: Active

## Table of Contents

1. [Introduction](#introduction)
2. [The Testing Pyramid](#the-testing-pyramid)
3. [Test Categories](#test-categories)
4. [When to Use Each Type](#when-to-use-each-type)
5. [Coverage Goals](#coverage-goals)
6. [Implementation Roadmap](#implementation-roadmap)
7. [General Principles](#general-principles)

---

## Introduction

This document provides a high-level overview of our testing strategy for the TypeScript/GraphQL/Vue full-stack application. It defines the different types of tests we use, when to apply each type, and how they work together to ensure application quality.

### Goals

- **Prevent regressions** - Catch breaking changes before production
- **Enable confident refactoring** - Change code without fear
- **Document behavior** - Tests serve as living documentation
- **Fast feedback loops** - Quick iteration during development
- **Production confidence** - High assurance that deployments work

---

## The Testing Pyramid

Our testing strategy follows the classic testing pyramid model:

```
                    /\
                   /  \
                  / E2E \              10% of tests
                 /______\              Slowest, most expensive
                /        \             Full browser, full stack
               /  Integ.  \
              /____________\           20% of tests
             /              \          Full module API tests
            /   Unit Tests   \         HTTP-level verification
           /__________________\
                                       70% of tests
                                       Test lib inputs/outputs
                                       May touch DB where appropriate
```

### Why This Shape?

- **More unit tests**: Test every lib function's inputs and outputs directly
- **Fewer integration tests**: Full module-level API tests that verify the complete HTTP stack
- **Minimal E2E tests**: Full user flow walkthroughs through the frontend app

### Anti-Pattern: Inverted Pyramid

**Avoid** having more E2E tests than unit tests:
- Slow feedback loops
- Difficult to maintain
- Flaky tests
- Long CI/CD pipelines
- Hard to debug failures

---

## Test Categories

### 1. Unit Tests

**Definition**: Tests that verify the inputs and outputs of library functions (`src/libs/`). They may touch the database where appropriate (e.g., store functions), otherwise they use `createMock` to get proxies of objects.

**Characteristics**:
- ✅ **Test inputs and outputs** of individual functions
- ✅ **Scoped to libs** (`src/libs/`)
- ✅ **May touch the database** where appropriate (e.g., store functions)
- ✅ **Use `createMock`** for dependencies that don't need to be real
- ✅ **Deterministic** (same input always produces same output)
- ✅ **Isolated** (no shared state between tests)

**What to unit test**:
- Pure utility functions (transformers, parsers, validators)
- Store functions (with real database)
- Token generation/validation logic
- Error parsers (e.g., `parsePrismaError`)
- Any function exported from `src/libs/`

**What NOT to unit test**:
- Module entry points and route handlers (those are integration tests)
- Generated code (GraphQL types, Prisma validators, API clients)
- Pure type definitions

**Example**:
```typescript
// ✅ UNIT TEST - Pure transformation
describe('transformUserProfile', () => {
  it('transforms Prisma UserProfile to GraphQL UserProfile', () => {
    const prismaProfile = {
      id: 'profile-123',
      userId: 'user-123',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = transformUserProfile(prismaProfile);

    expect(result).toEqual({
      id: 'profile-123',
      email: 'test@example.com',
    });
  });
});

// ✅ UNIT TEST - Store function with real database
describe('createWithLocalCredentials', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it('creates user in database with hashed password', async () => {
    const result = await createWithLocalCredentials({
      username: 'testuser',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBeDefined();
    }
  });

  it('returns USERNAME_EXISTS when username is taken', async () => {
    await createWithLocalCredentials({ username: 'existing', password: 'pass' });
    const result = await createWithLocalCredentials({ username: 'existing', password: 'other' });

    expect(result).toEqual({ success: false, error: 'USERNAME_EXISTS' });
  });
});
```

**Tools**: Vitest, vitest-mock-extended, @vue/test-utils, happy-dom

**Location**: `src/**/__tests__/**/*.test.ts` (in `__tests__` directories)

**Execution**: `npm run test` or `npm run test:unit`

---

### 2. Integration Tests

**Definition**: Full tests of modules that expose APIs (`src/modules/auth/`, `src/modules/graphql/`). They exercise the complete HTTP stack — routing, middleware, authentication, stores, and database — via supertest.

**Characteristics**:
- ✅ **Full module-level testing** via HTTP requests
- ✅ **Real database, real middleware, real auth**
- ✅ **Test the API contract** that clients actually consume
- ⚠️ **Slower execution** (seconds per test)
- ⚠️ **Require setup/teardown** (database seeding, cleanup)
- ❌ **No UI/browser** (API layer only)

**What to integration test**:
- **Auth module endpoints** (POST /auth/login/local, POST /auth/refresh, POST /auth/logout)
- **GraphQL module** (queries and mutations via HTTP, including auth middleware)
- **Full request/response cycles** (status codes, headers, cookies, response bodies)
- **Error handling** at the HTTP level (401, 403, 400, 500)

**What NOT to integration test**:
- Individual lib functions (those are unit tests)
- Frontend user flows (those are E2E tests)

**Example**:
```typescript
// ✅ INTEGRATION TEST - Full module API test
describe('POST /auth/login/local', () => {
  beforeEach(async () => {
    await cleanDatabase();
    await createTestUser({ username: 'testuser', password: 'password123' });
  });

  it('returns tokens on successful login', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login/local')
      .send({ username: 'testuser', password: 'wrong' });

    expect(response.status).toBe(401);
  });
});

// ✅ INTEGRATION TEST - GraphQL via HTTP
describe('GraphQL me query', () => {
  it('returns current user when authenticated', async () => {
    const { accessToken } = await loginTestUser(app);

    const response = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ query: '{ me { id username } }' });

    expect(response.status).toBe(200);
    expect(response.body.data.me.username).toBe('testuser');
  });

  it('rejects unauthenticated requests', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({ query: '{ me { id } }' });

    expect(response.status).toBe(401);
  });
});
```

**Tools**: Vitest, supertest, PostgreSQL (test database), Prisma

**Location**: `src/**/__tests__/**/*.int.test.ts` (in `__tests__` directories)

**Execution**: `npm run test:integration`

**Setup Requirements**:
- Test database instance
- Database migrations
- Test app with mounted modules
- Cleanup utilities

---

### 3. E2E Tests (End-to-End)

**Definition**: Full walkthroughs of user flows for the frontend app. They exercise the complete stack from browser through SSR, API, and database.

**Characteristics**:
- ✅ **Real browser** (Chromium, Firefox, WebKit)
- ✅ **Full stack** (database, backend, frontend, SSR)
- ✅ **User perspective** (interactions, navigation, forms)
- ⚠️ **Very slow** (seconds to minutes per test)
- ⚠️ **Can be flaky** (timing issues, network issues)
- ⚠️ **Expensive to maintain**

**What to E2E test**:
- **Complete user flow walkthroughs**:
  - User registration and login flow
  - Password reset flow
  - Data creation/editing workflows
- **SSR rendering** (full page loads, hydration)
- **Navigation flows** (client-side routing, deep links)

**What NOT to E2E test**:
- Individual lib functions (use unit tests)
- API endpoint behavior (use integration tests)
- Edge cases and error conditions (use unit/integration tests)
- Every possible path through the application

**Example**:
```typescript
// ✅ E2E TEST - Full browser workflow
describe('User Login Flow', () => {
  it('allows user to log in with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in form
    await page.fill('input[id="username"]', 'testuser');
    await page.fill('input[id="password"]', 'password123');

    // Submit
    await page.click('button[type="submit"]');

    // Verify redirect to home page
    await page.waitForURL('/');

    // Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-menu"]')).toContainText('testuser');
  });

  it('shows error message with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[id="username"]', 'testuser');
    await page.fill('input[id="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Verify error message appears
    await expect(page.locator('[role="alert"]')).toContainText('Invalid credentials');

    // Verify user stays on login page
    await expect(page).toHaveURL('/login');
  });
});
```

**Tools**: Playwright (recommended) or Cypress

**Location**: `tests/e2e/**/*.spec.ts`

**Execution**: `npm run test:e2e`

**Setup Requirements**:
- Test database (separate from integration tests)
- Backend server running
- Frontend build
- Browser automation setup

---

## When to Use Each Type

### Decision Tree

```
Is it a function in src/libs/?
│
├─ YES → UNIT TEST ✅
│        Test inputs and outputs directly.
│        May use real DB (stores) or createMock (other deps).
│        Examples: transformers, parsers, store functions, token logic
│
└─ NO → Is it an API module (src/modules/auth, src/modules/graphql)?
         │
         ├─ YES → INTEGRATION TEST 🔗
         │        Full HTTP-level tests of the module's API.
         │        Examples: POST /auth/login, GraphQL queries via HTTP
         │
         └─ NO → Is it the frontend app (src/modules/client)?
                  │
                  ├─ YES → E2E TEST 🌐
                  │        Full user flow walkthroughs in a browser.
                  │        Examples: login flow, form submission, navigation
                  │
                  └─ NO → Probably generated/config code (skip)
```

### Quick Reference Table

| Scenario | Test Type | Why |
|----------|-----------|-----|
| Pure data transformation | Unit | Lib function, test inputs/outputs |
| Error parsing | Unit | Lib function, deterministic |
| Store function (creates user) | Unit | Lib function, may use real DB |
| Token generation/validation | Unit | Lib function, use createMock for deps |
| Vue component rendering | Unit | Lib-like, isolated with mocked data |
| POST /auth/login/local endpoint | Integration | Full module API test via HTTP |
| GraphQL query via HTTP | Integration | Full module API test via HTTP |
| Token refresh endpoint | Integration | Full module API test via HTTP |
| User completes signup in browser | E2E | Full user flow walkthrough |
| Password reset flow in browser | E2E | Multi-step user flow walkthrough |

---

## Coverage Goals

### Target Distribution

| Test Type | Count Target | Coverage Target | Execution Time Target |
|-----------|--------------|-----------------|----------------------|
| Unit | 70% of tests | 85% of lib functions | < 30 seconds total |
| Integration | 20% of tests | API module endpoints | < 30 seconds total |
| E2E | 10% of tests | Critical user flows | < 3 minutes total |

### Coverage Metrics

**Overall code coverage target**: 75%

**By category**:
- Pure utilities: 90%
- Transformers: 90%
- Store functions: 85% (unit tests with real DB)
- Token logic: 80% (unit tests with createMock)
- Auth module endpoints: 80% (integration tests)
- GraphQL endpoints: 80% (integration tests)
- Vue components: 60% (unit tests for logic)
- Frontend user flows: critical paths (E2E tests)

**Excluded from coverage**:
- Generated code (`**/graphql-types/**`, `**/packages/**`)
- Type definitions (`**/*-types.ts`)
- Constants (`**/*-const.ts`)
- Simple re-exports (`**/index.ts`)
- Configuration files

---

## Implementation Roadmap

### Phase 1: Unit Testing Infrastructure ⬅️ **START HERE**
**Timeline**: Weeks 1-4
**Focus**: Pure functions, transformers, utilities

**Why start here**:
- Fastest to implement
- No complex setup required
- Establishes testing patterns
- Quick wins for team morale

**Deliverables**:
- Vitest configuration for unit tests
- Test utilities and factories
- 60+ unit tests covering transformers, utilities, parsers
- Documentation: `UNIT_TESTING_STRATEGY.md`

**See**: [`UNIT_TESTING_STRATEGY.md`](./UNIT_TESTING_STRATEGY.md) for details

---

### Phase 2: Integration Testing Infrastructure
**Timeline**: Weeks 5-8
**Focus**: Store functions, resolvers, authentication flows

**Prerequisites**:
- Unit testing infrastructure complete
- Team comfortable with testing patterns

**Deliverables**:
- Test database setup/teardown utilities
- Database seeding and cleanup scripts
- 80+ integration tests covering stores and resolvers
- Documentation: `INTEGRATION_TESTING_STRATEGY.md` (to be created)

**See**: [`INTEGRATION_TESTING_STRATEGY.md`](./INTEGRATION_TESTING_STRATEGY.md) (placeholder)

---

### Phase 3: E2E Testing Infrastructure
**Timeline**: Weeks 9-12
**Focus**: Critical user workflows

**Prerequisites**:
- Unit and integration tests established
- Core application functionality stable

**Deliverables**:
- Playwright setup and configuration
- Test user management
- 10-15 E2E tests for critical paths
- Documentation: `E2E_TESTING_STRATEGY.md` (to be created)

**See**: [`E2E_TESTING_STRATEGY.md`](./E2E_TESTING_STRATEGY.md) (placeholder)

---

### Phase 4: CI/CD Integration
**Timeline**: Week 13
**Focus**: Automated testing in pipeline

**Deliverables**:
- GitHub Actions workflows
- Coverage reporting (Codecov)
- PR requirements and gates
- Performance monitoring

---

### Phase 5: Continuous Improvement
**Timeline**: Ongoing
**Focus**: Maintain and improve test quality

**Activities**:
- Write tests for new features
- Refactor brittle tests
- Increase coverage incrementally
- Monitor flakiness
- Update strategies as needed

---

## General Principles

### 1. Test Behavior, Not Implementation

**Bad** (testing implementation):
```typescript
it('calls bcrypt.hash with 10 salt rounds', () => {
  // This test breaks when you change implementation details
});
```

**Good** (testing behavior):
```typescript
it('returns hashed password that can be verified', async () => {
  const hashed = await hashPassword('password123');
  const isValid = await verifyPassword('password123', hashed);
  expect(isValid).toBe(true);
});
```

### 2. Arrange-Act-Assert Pattern

Always structure tests clearly:

```typescript
it('does something', async () => {
  // Arrange - Set up test data and conditions
  const input = createTestUser({ username: 'test' });

  // Act - Execute the operation
  const result = await functionUnderTest(input);

  // Assert - Verify the outcome
  expect(result).toEqual(expectedOutput);
});
```

### 3. Test Isolation

Each test should:
- ✅ Run independently (no order dependency)
- ✅ Clean up after itself
- ✅ Not share mutable state with other tests
- ✅ Be able to run in parallel

### 4. Descriptive Test Names

Use clear, behavior-focused names:

**Bad**:
```typescript
it('test 1', () => { /* ... */ });
it('works', () => { /* ... */ });
```

**Good**:
```typescript
it('returns USERNAME_EXISTS error when username is already taken', () => { /* ... */ });
it('transforms null email to null in GraphQL response', () => { /* ... */ });
```

### 5. One Concept Per Test

Each test should verify one behavior:

**Bad** (testing multiple concepts):
```typescript
it('creates user and updates profile and sends email', async () => {
  // Too much happening, hard to debug when it fails
});
```

**Good** (focused tests):
```typescript
it('creates user with valid credentials', async () => { /* ... */ });
it('updates user profile after creation', async () => { /* ... */ });
it('sends welcome email to new user', async () => { /* ... */ });
```

### 6. Fail Fast, Fail Clearly

When a test fails:
- Error message should clearly indicate what went wrong
- Use descriptive expect messages when helpful
- Avoid generic assertions

**Good**:
```typescript
expect(result.success).toBe(true);
if (!result.success) {
  // This helps debugging
  console.error('Unexpected error:', result.error);
}
```

### 7. Don't Test Third-Party Code

**Don't test**:
- Prisma client behavior
- Vue.js reactivity system
- Express routing
- bcrypt hashing implementation

**Do test**:
- How you use these libraries
- Your business logic around them
- Integration points

### 8. Keep Tests Maintainable

- Use test factories for data generation
- Share test utilities across tests
- Refactor test code like production code
- Delete tests for removed features
- Update tests when requirements change

---

## Success Criteria

### Quantitative

- [ ] Unit tests execute in < 5 seconds
- [ ] Integration tests execute in < 30 seconds
- [ ] E2E tests execute in < 3 minutes
- [ ] Overall code coverage ≥ 75%
- [ ] Critical path coverage ≥ 90%
- [ ] Test suite runs successfully on every PR
- [ ] Flakiness rate < 1%

### Qualitative

- [ ] Developers write tests by default for new features
- [ ] Team feels confident making changes
- [ ] Bug detection rate increases
- [ ] Regression issues decrease
- [ ] Tests serve as useful documentation
- [ ] New team members can understand test patterns quickly

---

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Prisma Testing Guide](https://www.prisma.io/docs/orm/prisma-client/testing)
- [Testing Library Philosophy](https://testing-library.com/docs/guiding-principles)

### Internal Docs
- [Unit Testing Strategy](./UNIT_TESTING_STRATEGY.md) ✅ Active
- [Integration Testing Strategy](./INTEGRATION_TESTING_STRATEGY.md) 📝 TODO
- [E2E Testing Strategy](./E2E_TESTING_STRATEGY.md) 📝 TODO

### Articles
- [The Testing Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Testing Best Practices](https://kentcdodds.com/blog/common-testing-mistakes)
- [Write Tests. Not Too Many. Mostly Integration.](https://kentcdodds.com/blog/write-tests)

---

## Maintenance

This document should be reviewed and updated:

- **Quarterly** - Ensure strategy aligns with project needs
- **When tooling changes** - New test frameworks, libraries
- **When architecture changes** - New patterns, modules
- **When team grows** - Onboard new developers to testing approach

**Document Owner**: Engineering Team Lead
**Last Review**: 2026-02-21
**Next Review**: 2026-05-21

---

## Appendix: Common Questions

### Q: Why do unit tests touch the database for store functions?

**A**: Store functions are lib functions whose purpose is database interaction. Mocking Prisma creates a false sense of security — you'd only be testing that your code calls Prisma methods, not that the queries work. Unit tests for stores use a real database to catch SQL errors, constraint violations, and schema mismatches. Use `createMock` for dependencies that aren't central to the function being tested.

### Q: What's the difference between unit tests with a DB and integration tests?

**A**: Scope. Unit tests test a single lib function's inputs and outputs — even if that function uses the database. Integration tests test an entire API module end-to-end via HTTP (routing, middleware, auth, stores, response formatting). Unit tests call `createWithLocalCredentials()` directly; integration tests send `POST /auth/login/local` via supertest.

### Q: Should I write unit tests for Vue components?

**A**: Yes, but:
- Mock API calls and composables
- Focus on component logic, user interactions, computed properties
- Don't test Vue internals (reactivity, lifecycle)
- Keep components simple so tests stay simple

### Q: How many E2E tests should I write?

**A**: As few as possible, as many as necessary:
- Cover critical user workflows (login, checkout, etc.)
- One happy path per major feature
- Critical error scenarios
- Don't duplicate coverage from integration tests

### Q: Can I run all tests together?

**A**: Separate commands are better:
```bash
npm run test          # Unit tests (fast, always run)
npm run test:integration  # Integration tests (moderate, run often)
npm run test:e2e      # E2E tests (slow, run before deploy)
npm run test:all      # Everything (CI/CD)
```

### Q: What about snapshot testing?

**A**: Use sparingly:
- Good for: Component markup that rarely changes
- Bad for: Dynamic content, frequently changing UI
- Problem: Snapshots can be updated without review, hiding bugs
- Recommendation: Prefer explicit assertions

---

**End of Testing Strategy Overview**
