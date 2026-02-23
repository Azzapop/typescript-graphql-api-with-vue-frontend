import { setupWorkerDatabase, teardownWorkerDatabase } from './database';

/**
 * Global setup runs once before all tests
 * Sets up the test database schema
 */
export async function setup(): Promise<void> {
  console.log('[Integration Tests] Setting up database schema...');
  await setupWorkerDatabase();
  console.log('[Integration Tests] Database schema ready');
}

/**
 * Global teardown runs once after all tests
 * Cleans up the test database schema
 */
export async function teardown(): Promise<void> {
  console.log('[Integration Tests] Tearing down database schema...');
  await teardownWorkerDatabase();
  console.log('[Integration Tests] Database schema cleaned up');
}
