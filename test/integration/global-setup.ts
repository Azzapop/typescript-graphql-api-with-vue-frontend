import { setupWorkerDatabase, teardownWorkerDatabase } from './database';

/**
 * Global setup runs once per Vitest worker
 * Sets up the worker's isolated database schema
 */
export async function setup(): Promise<void> {
  const workerId = process.env.VITEST_POOL_ID || '1';
  console.log(`[Worker ${workerId}] Setting up database schema...`);
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
