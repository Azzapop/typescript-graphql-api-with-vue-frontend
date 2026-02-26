# Unit Testing Strategy

**Version**: 1.1
**Last Updated**: 2026-02-22
**Status**: ✅ Pure Functions Complete - 87 tests passing
**Parent Document**: [Testing Strategy Overview](./TESTING_STRATEGY.md)

## Overview

This document provides a comprehensive strategy for implementing unit tests in the TypeScript/GraphQL/Vue application. Unit tests verify the **inputs and outputs of library functions** (`src/libs/`). They may touch the database where appropriate (e.g., store functions), otherwise they use `createMock` to get proxies of objects.

### Definition

A unit test:

- ✅ Tests a single function's inputs and outputs
- ✅ Scoped to `src/libs/` functions
- ✅ May use a real database where appropriate (e.g., store functions)
- ✅ Uses `createMock` for dependencies that don't need to be real
- ✅ Is deterministic (same input → same output)
- ✅ Runs independently of other tests

### Purpose

- **Fast feedback** during development (TDD-friendly)
- **Confidence in lib functions** (transformations, stores, validations, token logic)
- **Documentation** of function behavior
- **Regression protection** for library code
- **Foundation** for test-driven development

### What Unit Tests Are NOT

- ❌ Not for testing API modules end-to-end (that's integration tests)
- ❌ Not for testing complete user workflows through the browser (that's E2E tests)
- ❌ Not for testing generated code (GraphQL types, Prisma validators, API clients)

---

## Scope of Unit Tests

### In Scope ✅

**Pure Utility Functions**:

- `src/libs/trace-token/generate-trace-token.ts`
- `src/database/parse-prisma-error.ts`
- Any function with no external dependencies

**Data Transformers**:

- `src/libs/graphql-transformers/transform-user-profile.ts`
- Any Prisma → GraphQL transformation
- Any data mapping or conversion logic

**Store Functions** (with real database):

- `src/libs/domain-model/stores/**`
- Test inputs and outputs against a real PostgreSQL database
- Use database cleanup between tests

**Validation Logic**:

- Input validators
- Schema validators (if not generated)
- Business rule validators

**Token Logic** (with `createMock` for dependencies):

- `src/libs/auth-tokens/access-tokens/sign-access-token.ts`
- `src/libs/auth-tokens/access-tokens/verify-access-token.ts`
- Token generation and verification

**Vue Components** (with mocked composables/API calls):

- Component rendering
- User interactions (clicks, inputs)
- Computed properties
- Event emission
- Props validation

**Error Handling**:

- Error class constructors
- Error message formatting
- Error code mapping

### Out of Scope ❌

**API Modules** → Integration Tests:

- Route handlers (`src/modules/auth/routes/**`)
- GraphQL resolvers (`src/modules/graphql/resolvers/**`)
- Module entry points (`src/modules/*/entry.ts`)
- These are tested as full modules via HTTP in integration tests

**Frontend App** → E2E Tests:

- Complete user flow walkthroughs
- Browser-based interactions

**Generated Code**:

- GraphQL types, validators
- Prisma types, validators
- API clients

**Pure Type Definitions**:

- Files with only `type` and `interface` declarations
- Constant files
- Config files

---

## Tools and Setup

### Install Dependencies

```bash
npm install -D \
  vitest@latest \
  @vitest/coverage-v8@latest \
  vitest-mock-extended@latest \
  @vue/test-utils@latest \
  happy-dom@latest
```

### Vitest Configuration

Create `vitest.config.ts`:

```typescript
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths({ loose: true }), vue()],
  test: {
    globals: true,
    environment: 'node',

    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],

    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.integration.test.ts',
      '**/*.e2e.test.ts',
      '**/*.gql.ts',
    ],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],

      include: [
        'src/libs/**/!(*.test|*.spec).ts',
        'src/modules/**/!(*.test|*.spec).ts',
      ],

      exclude: [
        '**/index.ts',
        '**/*-types.ts',
        '**/*-const.ts',
        '**/*-config.ts',
        '**/graphql-types/**',
        '**/packages/**',
        '**/stores/**',
        '**/resolvers/**',
        '**/routes/**',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],

      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
    },

    pool: 'threads',
  },
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest watch",
    "test:unit:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:coverage:watch": "vitest watch --coverage"
  }
}
```

---

## Implementation Plan

### Phase 1: Infrastructure (Week 1) - 2-3 hours

1. Install dependencies
2. Create `vitest.config.ts`
3. Update `package.json` scripts
4. Create test utilities structure

### Phase 2: Factories (Week 1) - 1-2 hours

Create test data factories:

- `test/factories/user-factory.ts`
- `test/factories/user-profile-factory.ts`
- `test/factories/index.ts`

### Phase 3: Transformers (Week 2) - 1-2 hours

Test GraphQL transformers:

- `src/libs/graphql-transformers/transform-user-profile.test.ts`

### Phase 4: Utilities (Week 2) - 3-4 hours

Test utility functions:

- `src/libs/trace-token/generate-trace-token.test.ts`
- `src/database/__tests__/parse-prisma-error.test.ts`

### Phase 5: Token Logic (Week 3) - 4-6 hours

Test auth tokens (with mocked crypto):

- `sign-access-token.test.ts`
- `verify-access-token.test.ts`
- `sign-refresh-token.test.ts`
- `verify-refresh-token.test.ts`

### Phase 6: Vue Components (Week 3-4) - 6-8 hours

Test Vue components:

- `LoginForm.test.ts`
- Other components with logic

### Phase 7: CI/CD (Week 5) - 2-3 hours

Set up GitHub Actions for unit tests

**Total Estimated Effort**: ~25-35 hours over 5 weeks

---

## Testing Checklist

Track progress as each lib/module is analyzed and tested. Each PR should focus on one area.

### Libraries (`src/libs/`)

#### Core Utilities
- [x] `async-handler.ts` - Express async error handling ✅ 100% coverage (4 tests)
- [x] `client-utils/assert.ts` - Runtime assertions ✅ 100% coverage (5 tests)

#### Auth & Security
- [ ] `auth-middleware/` - Analyze for pure validation/parsing logic (strategies are integration tests)
- [x] `auth-tokens/generate-token-version.ts` - Cryptographically secure UUID v4 ✅ 100% coverage (3 tests)
- [x] `auth-tokens/access-tokens/sign-access-token.ts` - JWT signing with mocked jose ✅ 100% coverage (6 tests)
- [x] `auth-tokens/access-tokens/verify-access-token.ts` - JWT verification with mocked jose ✅ 100% coverage (4 tests)
- [x] `auth-tokens/refresh-tokens/sign-refresh-token.ts` - Refresh JWT signing with mocked jose ✅ 100% coverage (6 tests)
- [x] `auth-tokens/refresh-tokens/verify-refresh-token.ts` - Refresh JWT verification with mocked jose ✅ 100% coverage (4 tests)

#### Domain Model
- [ ] `domain-model/models/` - Type definitions only (skip)
- [x] `database/parse-prisma-error.ts` - Prisma error parsing and mapping ✅ 100% coverage (19 tests)
- [ ] `domain-model/stores/user/` - User store functions (with real DB)
- [ ] `domain-model/stores/refresh-token/` - RefreshToken store functions (with real DB)
- [ ] `domain-model/stores/local-credentials/` - LocalCredentials store functions (with real DB)
- [ ] `domain-model/types/` - Type definitions only (skip)

#### GraphQL
- [x] `graphql-errors/bad-input-error.ts` - BadInputError class ✅ 100% coverage (3 tests)
- [x] `graphql-errors/bad-parse-error.ts` - BadParseError class ✅ 100% coverage (3 tests)
- [x] `graphql-errors/internal-server-error.ts` - InternalServerError class ✅ 100% coverage (5 tests)
- [x] `graphql-errors/not-found-error.ts` - NotFoundError class ✅ 100% coverage (3 tests)
- [x] `graphql-transformers/transform-user-profile.ts` - Prisma to GraphQL transformations ✅ 100% coverage (6 tests)
- [ ] `graphql-types/` - Generated (skip)
- [ ] `graphql-validators/` - Generated (skip)

#### Utilities
- [x] `logger/is-vite-request.ts` - Vite request detection ✅ 100% coverage (12 tests)
- [ ] `module/` - Framework code (skip)
- [ ] `prisma-validators/` - Generated (skip)
- [ ] `trace-context/` - Uses AsyncLocalStorage (integration test)
- [x] `trace-token/generate-trace-token.ts` - Trace token generation ✅ 100% coverage (3 tests)

#### Generated/External
- [ ] `packages/` - Generated API clients (skip)

### Modules (`src/modules/`)

#### Auth Module (`modules/auth/`)
- [ ] `routes/` - Integration tests only (skip for unit tests)
- [ ] Analyze for any utility functions

#### GraphQL Module (`modules/graphql/`)
- [ ] `resolvers/` - Integration tests only (skip for unit tests)
- [ ] `type-defs.graphql` - Schema definition (skip)

#### Client Module (`modules/client/`)
- [ ] `app/components/` - Test components with complex logic
- [ ] `app/composables/` - Test pure composables (with mocked APIs)
- [ ] `app/layout/` - Test layout components if complex
- [ ] `app/pages/` - Test page components with logic
- [ ] `app/pages/auth/login/LoginForm.vue` - **PRIORITY** Test form component
- [ ] `app/plugins/` - Analyze for testable logic
- [ ] `app/router/` - Analyze for pure route guards/utilities
- [ ] `app/stores/` - Test Pinia stores (with mocked APIs)
- [ ] `app/utils/` - Test any utility functions

### Progress Tracking

**Completed**: 15 test files / 87 tests
- ✅ Core utilities (2 files, 9 tests)
- ✅ Auth tokens (5 files, 23 tests)
- ✅ Domain model utilities (1 file, 19 tests)
- ✅ GraphQL errors (4 files, 14 tests)
- ✅ GraphQL transformers (1 file, 6 tests)
- ✅ Logger utilities (1 file, 12 tests)
- ✅ Trace tokens (1 file, 3 tests)

**Coverage**: 100% of testable pure utility functions

**Remaining**: Vue components, composables, Pinia stores (require UI testing setup)

---

## Testing Patterns

### File Organization

Use `__tests__` directories within each module/library:

```
src/libs/graphql-transformers/
├── __tests__/
│   └── transform-user-profile.test.ts
└── transform-user-profile.ts
```

**Pattern**: Place test files in a `__tests__` directory at the same level as the source files they test.

**Benefits**:
- Clear separation of tests from production code
- Easy to exclude from builds
- Common Node.js convention
- Keeps directory structure clean

### Test Structure

Use Arrange-Act-Assert:

```typescript
import { describe, it, expect } from 'vitest';

describe('functionUnderTest', () => {
  describe('when given valid input', () => {
    it('returns expected result', () => {
      // Arrange
      const input = { data: 'test' };

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toEqual({ processed: 'test' });
    });
  });
});
```

### Mocking Dependencies

Mock external libraries:

```typescript
import { vi } from 'vitest';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed'),
  compare: vi.fn().mockResolvedValue(true),
}));
```

Always reset mocks:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

---

## Coverage Goals

| Category       | Target  |
| -------------- | ------- |
| Transformers   | 90%     |
| Utilities      | 90%     |
| Error parsers  | 90%     |
| Validation     | 85%     |
| Token logic    | 80%     |
| Vue components | 60%     |
| **Overall**    | **85%** |

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-testing-mistakes)

---

**Document Owner**: Engineering Team Lead
**Last Review**: 2026-02-21
**Next Review**: 2026-05-21

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-testing-mistakes)

---

**Document Owner**: Engineering Team Lead
**Last Review**: 2026-02-21
**Next Review**: 2026-05-21
