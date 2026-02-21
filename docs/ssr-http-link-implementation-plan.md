# SSR HTTP Link Implementation Plan

## Goal
Replace SchemaLink with HttpLink for SSR to achieve consistent error handling between server and client rendering.

---

## Phase 1: Branch Setup & Preparation

### 1.1 Create Feature Branch
```bash
git checkout -b feature/ssr-http-link
```

### 1.2 Document Current State
- Current SSR: Uses SchemaLink (direct schema execution)
- Current Client: Uses HttpLink (HTTP to `/graphql`)
- Current issue: `errorPolicy: 'none'` causes async errors with SchemaLink

---

## Phase 2: Analysis & Prerequisites

### 2.1 Understand Current Flow

**SSR Current:**
```
Request → renderHtml() → Apollo (SchemaLink) → Execute schema directly → Render
```

**SSR Target:**
```
Request → renderHtml() → Apollo (HttpLink) → HTTP to localhost:3000/graphql → Render
```

### 2.2 Identify Dependencies
- GraphQL server must be running before SSR can execute
- Need to ensure authentication/context passed correctly via HTTP
- Trace tokens must propagate through HTTP requests
- Error links must work with HTTP errors

### 2.3 Potential Issues to Address
1. **Circular dependency**: SSR server needs GraphQL server running
2. **Authentication**: How to pass user context via HTTP instead of direct context
3. **Performance**: HTTP overhead vs direct schema execution
4. **Error handling**: Network errors vs schema errors
5. **Trace tokens**: Must be preserved through HTTP layer

---

## Phase 3: Implementation Changes

### 3.1 Update SSR Apollo Client Creation

**File**: `src/modules/client/server-entry/render-html/index.ts`

**Current:**
```typescript
const apolloClient = createApolloClient({
  ssrMode: true,
  links: [
    links.createGraphQLErrorLink(...),
    links.createSchemaLink(schema, context),  // ← Remove
  ],
});
```

**Target:**
```typescript
const apolloClient = createApolloClient({
  ssrMode: true,
  links: [
    links.createGraphQLErrorLink(...),
    links.createNetworkErrorLink(...),  // ← Add (now relevant for SSR)
    createSSRHttpLink(userId),           // ← New: HTTP link with auth
  ],
});
```

### 3.2 Create SSR HTTP Link with Authentication

**New file**: `src/libs/apollo-client/links/create-ssr-http-link.ts`

**Purpose**: Create HTTP link that passes authentication for SSR

**Requirements:**
- Must pass `userId` to GraphQL server
- Options:
  - **Option A**: Include auth token in headers (generate access token)
  - **Option B**: Use internal authentication header (e.g., `x-internal-user-id`)
  - **Option C**: Make SSR requests bypass auth middleware (internal flag)

**Recommended**: Option B - Internal header for SSR requests

```typescript
export const createSSRHttpLink = (userId: string | null) => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:3000/graphql',
    // Fetch options
  });

  const authLink = setContext(() => ({
    headers: {
      'x-ssr-user-id': userId,           // Pass user ID
      'x-trace-token': generateTraceToken(), // Trace token
      'x-internal-request': 'true',      // Mark as internal
    },
  }));

  return from([authLink, httpLink]);
};
```

### 3.3 Update GraphQL Middleware for SSR Requests

**File**: `src/modules/graphql/entry.ts`

**Changes needed:**
1. Detect internal SSR requests (via `x-internal-request` header)
2. Extract `x-ssr-user-id` header
3. Create user context from header instead of JWT token
4. Skip normal authentication for internal requests

**Implementation approach:**
```typescript
router.use((req, res, next) => {
  const isInternalSSR = req.headers['x-internal-request'] === 'true';

  if (isInternalSSR) {
    // SSR path: Get user from header
    const userId = req.headers['x-ssr-user-id'];
    req.user = userId ? { id: userId, ... } : undefined;
    next();
  } else {
    // Normal path: Use JWT authentication
    authenticate('access-token', { onFailure: 'reject' })(req, res, next);
  }
});
```

### 3.4 Remove Schema Import from SSR

**File**: `src/modules/client/server-entry/render-html/index.ts`

**Current:**
```typescript
import { createSchema } from '~modules/graphql';

const schema = createSchema(); // ← Remove (no longer needed)
```

**Target:**
- Remove schema import
- Remove schema creation
- SSR bundle becomes smaller (no resolvers bundled)

### 3.5 Update Error Policy

**File**: `src/libs/apollo-client/create-apollo-client.ts`

**Can now use `errorPolicy: 'none'` for both:**
```typescript
defaultOptions: {
  query: {
    errorPolicy: 'none',  // ← Same for SSR and client!
  },
  watchQuery: {
    errorPolicy: 'none',
  },
},
```

**Benefit**: Consistent behavior, no partial data handling needed

---

## Phase 4: Server Startup Order

### 4.1 Ensure GraphQL Server Starts First

**File**: `src/server.ts`

**Current behavior**: Modules mount in parallel

**Required change**: Ensure GraphQL module is ready before client module

**Approach:**
```typescript
// Mount GraphQL first
const graphqlModule = await graphqlEntry({ httpServer });
mountModules(expressServer, [graphqlModule]);
await graphqlModule.ready(); // If we add lifecycle hooks

// Then mount client (which depends on GraphQL via HTTP)
const clientModule = await clientEntry();
mountModules(expressServer, [clientModule]);
```

**Alternative**: Accept that GraphQL must be running; handle errors gracefully if not

---

## Phase 5: Testing Strategy

### 5.1 Unit Tests
- Test SSR HTTP link creation
- Test internal auth header handling
- Test error link behavior with HTTP errors

### 5.2 Integration Tests
- SSR renders correctly with authenticated user
- SSR handles GraphQL errors properly
- SSR handles network errors properly
- Public routes work without user
- Error page renders on SSR errors

### 5.3 Manual Testing Checklist
- [ ] `/app` renders with user data (SSR)
- [ ] `/login` renders without GraphQL (public)
- [ ] GraphQL errors show error page
- [ ] Network errors show error page
- [ ] Trace tokens preserved end-to-end
- [ ] Client hydration works correctly
- [ ] No hydration mismatches
- [ ] Performance acceptable (measure before/after)

---

## Phase 6: Performance Considerations

### 6.1 Benchmark Current vs New

**Measure:**
- SSR time with SchemaLink (current)
- SSR time with HttpLink (new)
- Difference in response times

**Expected impact:**
- +5-20ms per SSR request (localhost HTTP overhead)
- Acceptable for most use cases
- Can optimize with keep-alive connections

### 6.2 Optimization Options
- Use HTTP keep-alive
- Connection pooling
- Unix socket instead of TCP (faster)

---

## Phase 7: Rollback Strategy

### 7.1 Feature Flag Approach

**Add environment variable:**
```typescript
const USE_SSR_HTTP_LINK = process.env.SSR_USE_HTTP_LINK === 'true';

const apolloClient = USE_SSR_HTTP_LINK
  ? createApolloClient({ links: [httpLink] })
  : createApolloClient({ links: [schemaLink] });
```

**Benefit**: Can toggle between implementations

### 7.2 Monitoring
- Track SSR error rates before/after
- Monitor SSR response times
- Watch for new error patterns

---

## Phase 8: Documentation Updates

### 8.1 Update CLAUDE.md
- Document SSR HTTP link approach
- Note authentication header pattern
- Explain why HTTP link is used for SSR

### 8.2 Update Memory
- Record the change
- Note any gotchas discovered

---

## Implementation Order

1. **Step 1**: Create branch
2. **Step 2**: Create `createSSRHttpLink` helper
3. **Step 3**: Update GraphQL middleware to handle internal requests
4. **Step 4**: Update SSR to use HTTP link
5. **Step 5**: Remove schema import from SSR bundle
6. **Step 6**: Update `errorPolicy` to `'none'` for both
7. **Step 7**: Test thoroughly
8. **Step 8**: Measure performance
9. **Step 9**: Document changes
10. **Step 10**: Merge or iterate

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| GraphQL server not ready | SSR fails | Add health check, retry logic |
| Authentication issues | Unauthorized errors | Test thoroughly, add logging |
| Performance degradation | Slower SSR | Benchmark, optimize, consider feature flag |
| New error patterns | Site issues | Monitor closely, have rollback plan |
| Hydration mismatches | UI bugs | Extensive testing, same errorPolicy |

---

## Success Criteria

- ✅ SSR uses HTTP link instead of schema link
- ✅ Both SSR and client use `errorPolicy: 'none'`
- ✅ Consistent error handling everywhere
- ✅ No type safety issues with partial data
- ✅ All tests pass
- ✅ Performance acceptable (<20ms overhead)
- ✅ No new errors in production

---

## Questions to Resolve Before Implementation

1. **Authentication approach**: Internal header vs JWT vs other?
2. **Port/URL**: Use `localhost:3000` or environment variable?
3. **Error handling**: How to handle "GraphQL server not available"?
4. **Feature flag**: Want ability to toggle back to schema link?
5. **Performance budget**: What's acceptable SSR time increase?

---

## Current Blockers

### errorPolicy Configuration Issue

**Location**: `src/libs/apollo-client/create-apollo-client.ts`

**Current state**:
- SSR set to `'none'` but causes async errors after renderToString
- Must use `'all'` for SSR, but creates inconsistency with client

**Specific Problem - Hydration Mismatch**:

With the current SchemaLink setup and `errorPolicy: 'all'` for SSR:

1. `renderToString()` executes and queries run via SchemaLink
2. GraphQL errors occur and are returned in the result (not thrown due to 'all')
3. `renderToString()` completes and captures HTML
4. Error link processes errors **asynchronously** after `renderToString()` finishes
5. Error link sets `globalError` in store (too late)
6. Server sends HTML without error state (normal layout rendered)
7. Client hydrates with initial store state (no error)
8. Error link runs on client and sets `globalError`
9. Client re-renders from normal layout to ErrorPage
10. **Hydration mismatch**: Server rendered AppLayout, client expects ErrorPage

**Current Workaround**:
In `render-html/index.ts`, check if `globalError` was set after first render and re-render if needed:
```typescript
let appHtml = await renderToString(app, context);
if (useGlobalErrorStore(store).globalError) {
  // Re-render with error state to avoid hydration mismatch
  appHtml = await renderToString(app, context);
}
```

**Resolution**:
This will be fixed once SSR uses HTTP link instead of schema link:
- HTTP requests are fully awaited before `renderToString()` completes
- Error link processes errors synchronously during the request
- `globalError` is set before rendering finishes
- Server sends correct HTML with error page rendered
- No hydration mismatch

Both SSR and client can use `errorPolicy: 'none'` consistently.

See TODO comment in code for tracking.
