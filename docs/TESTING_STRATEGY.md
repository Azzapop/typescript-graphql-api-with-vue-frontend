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
              /____________\           30% of tests
             /              \          Moderate speed, moderate cost
            /   Unit Tests   \         Real database, no browser
           /__________________\
                                       60% of tests
                                       Fastest, cheapest
                                       Isolated, mocked dependencies
```

### Why This Shape?

- **More unit tests**: Fast, isolated, easy to write and maintain
- **Fewer integration tests**: Slower, require database setup, test interactions
- **Minimal E2E tests**: Slowest, most brittle, test critical user workflows only

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

**Definition**: Tests that verify a single unit of code in isolation, with all external dependencies mocked.

**Characteristics**:
- ✅ **No I/O operations** (no database, no filesystem, no network)
- ✅ **Fast execution** (milliseconds per test)
- ✅ **Deterministic** (same input always produces same output)
- ✅ **Isolated** (no shared state between tests)
- ✅ **Mocked dependencies** (external modules are mocked)

**What to unit test**:
- Pure utility functions
- Data transformers (e.g., Prisma → GraphQL transformers)
- Business logic that doesn't touch external systems
- Vue component rendering and user interactions (with mocked API calls)
- Token generation/validation logic (with mocked signing/verification)
- Error parsers (e.g., `parsePrismaError`)
- Validation logic

**What NOT to unit test**:
- Store functions (they use Prisma → database)
- GraphQL resolvers (they call stores → database)
- Express route handlers (they call stores)
- Any function that performs I/O

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

  it('returns null for email when email is null', () => {
    const prismaProfile = createTestUserProfile({ email: null });
    const result = transformUserProfile(prismaProfile);
    expect(result.email).toBeNull();
  });
});
```

**Tools**: Vitest, vitest-mock-extended, @vue/test-utils, happy-dom

**Location**: `src/**/__tests__/**/*.test.ts` (in `__tests__` directories)

**Execution**: `npm run test` or `npm run test:unit`

---

### 2. Integration Tests

**Definition**: Tests that verify multiple units working together with real external dependencies (database, APIs, etc.).

**Characteristics**:
- ✅ **Real I/O operations** (real database, real file system)
- ⚠️ **Slower execution** (seconds per test)
- ✅ **Test interactions** (how units work together)
- ⚠️ **Require setup/teardown** (database seeding, cleanup)
- ❌ **No UI/browser** (backend only)

**What to integration test**:
- **Store functions** (Prisma client → PostgreSQL database)
- **GraphQL resolvers** (resolver → store → database)
- **Authentication flows** (login → token generation → database verification)
- **API route handlers** (Express route → store → database)
- **Module integration** (how modules interact with each other)
- **SSR rendering** (server-side GraphQL queries)

**What NOT to integration test**:
- Pure functions (those should be unit tests)
- Complete user workflows through UI (those are E2E tests)

**Example**:
```typescript
// ✅ INTEGRATION TEST - Real database
describe('createWithLocalCredentials (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase(); // Real database cleanup
  });

  it('creates user in database with hashed password', async () => {
    const result = await createWithLocalCredentials({
      username: 'testuser',
      password: 'password123',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      // Verify in real database
      const dbUser = await prisma.user.findUnique({
        where: { id: result.data.id },
        include: { localCredentials: true },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser!.localCredentials!.username).toBe('testuser');
      expect(dbUser!.localCredentials!.hashedPassword).not.toBe('password123');

      // Verify password was hashed correctly
      const isValid = await bcrypt.compare(
        'password123',
        dbUser!.localCredentials!.hashedPassword
      );
      expect(isValid).toBe(true);
    }
  });

  it('returns USERNAME_EXISTS when username is taken', async () => {
    // Create first user in real database
    await createWithLocalCredentials({
      username: 'existing',
      password: 'password123',
    });

    // Try to create duplicate
    const result = await createWithLocalCredentials({
      username: 'existing',
      password: 'different',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('USERNAME_EXISTS');
    }
  });
});
```

**Tools**: Vitest, PostgreSQL (test database), Prisma

**Location**: `src/**/__tests__/**/*.integration.test.ts` (in `__tests__` directories)

**Execution**: `npm run test:integration`

**Setup Requirements**:
- Test database instance
- Database migrations
- Seed data scripts
- Cleanup utilities

---

### 3. E2E Tests (End-to-End)

**Definition**: Tests that verify complete user workflows through the entire application stack, including the browser.

**Characteristics**:
- ✅ **Real browser** (Chromium, Firefox, WebKit)
- ✅ **Full stack** (database, backend, frontend, SSR)
- ✅ **User perspective** (interactions, navigation, forms)
- ⚠️ **Very slow** (seconds to minutes per test)
- ⚠️ **Can be flaky** (timing issues, network issues)
- ⚠️ **Expensive to maintain**

**What to E2E test**:
- **Critical user workflows**:
  - User registration and login
  - Password reset flow
  - Data creation/editing workflows
  - Checkout/payment flows (if applicable)
- **Cross-browser compatibility** (for critical features)
- **SSR rendering** (full page loads)
- **Navigation flows**
- **Error states** (network errors, validation errors)

**What NOT to E2E test**:
- Individual component behavior (use unit tests)
- Data transformation logic (use unit tests)
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
Does it touch the database, filesystem, or external API?
│
├─ NO → Can it be tested in isolation?
│       │
│       ├─ YES → UNIT TEST ✅
│       │        Examples: transformers, pure utilities, parsers
│       │
│       └─ NO → Why not? If it requires real browser/UI interaction
│                → E2E TEST 🌐
│
└─ YES → Does it require a browser?
         │
         ├─ NO → INTEGRATION TEST 🔗
         │        Examples: stores, resolvers, route handlers
         │
         └─ YES → E2E TEST 🌐
                  Examples: login flow, form submission
```

### Quick Reference Table

| Scenario | Test Type | Why |
|----------|-----------|-----|
| Pure data transformation | Unit | No dependencies, fast |
| Error parsing | Unit | No I/O, deterministic |
| Vue component rendering | Unit | Isolated with mocked data |
| Token generation (mocked crypto) | Unit | Pure logic, mocked I/O |
| Store function (creates user) | Integration | Uses Prisma → database |
| GraphQL resolver | Integration | Calls stores → database |
| Login route handler | Integration | Database + auth flow |
| User completes signup form | E2E | Requires browser + full stack |
| Password reset flow | E2E | Multi-step user workflow |

---

## Coverage Goals

### Target Distribution

| Test Type | Count Target | Coverage Target | Execution Time Target |
|-----------|--------------|-----------------|----------------------|
| Unit | 60% of tests (~200 tests) | 85% of pure functions | < 5 seconds total |
| Integration | 35% of tests (~120 tests) | 80% of stores/resolvers | < 30 seconds total |
| E2E | 5% of tests (~15 tests) | Critical user paths | < 3 minutes total |

### Coverage Metrics

**Overall code coverage target**: 75%

**By category**:
- Pure utilities: 90%
- Transformers: 90%
- Store functions: 85% (integration tests)
- GraphQL resolvers: 80% (integration tests)
- Vue components: 60% (unit tests for logic)
- Route handlers: 75% (integration tests)

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

### Q: Why not mock the database for store tests?

**A**: Mocking Prisma for store tests creates a false sense of security. You're testing that your code calls Prisma methods correctly, but not that your database interactions actually work. Integration tests with a real database catch:
- SQL syntax errors
- Schema mismatches
- Transaction issues
- Constraint violations
- Performance problems

### Q: Aren't integration tests slow?

**A**: Yes, slower than unit tests, but:
- Still fast enough for TDD (sub-second for individual tests)
- Run in parallel to improve performance
- Provide much more value than mocked alternatives
- Worth the trade-off for critical paths

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
