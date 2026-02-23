/**
 * Setup file that runs before each test file loads
 * Sets DATABASE_URL with worker schema so Prisma client uses correct schema
 */

const workerId = process.env.VITEST_POOL_ID || '1';
const baseUrl = process.env.DATABASE_URL?.split('?')[0]; // Remove any existing query params
const schema = `test_worker_${workerId}`;

// Set DATABASE_URL with worker schema
// This must happen BEFORE any modules that create Prisma clients are imported
process.env.DATABASE_URL = `${baseUrl}?schema=${schema}`;

console.log(
  `[Worker ${workerId}] Environment configured with schema: ${schema}`
);
