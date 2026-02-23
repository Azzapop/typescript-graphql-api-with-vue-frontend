import { setupWorkerDatabase, teardownWorkerDatabase } from './database';

/**
 * Global setup runs once per Vitest worker
 * Sets up the worker's isolated database schema
 */
export async function setup(): Promise<void> {
  const workerId = process.env.VITEST_POOL_ID || '1';
  console.log(`[Worker ${workerId}] Setting up database schema...`);

  // IMPORTANT: Set DATABASE_URL with worker schema BEFORE setupWorkerDatabase
  // This ensures any Prisma clients created by the stores will use the correct schema
  const baseUrl = process.env.DATABASE_URL?.split('?')[0]; // Remove any existing query params
  const schema = `test_worker_${workerId}`;
  process.env.DATABASE_URL = `${baseUrl}?schema=${schema}`;

  await setupWorkerDatabase();
  console.log(`[Worker ${workerId}] Database schema ready`);
}

/**
 * Global teardown runs once per Vitest worker
 * Cleans up the worker's database schema
 */
export async function teardown(): Promise<void> {
  const workerId = process.env.VITEST_POOL_ID || '1';
  console.log(`[Worker ${workerId}] Tearing down database schema...`);
  await teardownWorkerDatabase();
  console.log(`[Worker ${workerId}] Database schema cleaned up`);
}
