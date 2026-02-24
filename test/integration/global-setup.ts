import { setupWorkerDatabase } from './setup-worker-database';
import { teardownWorkerDatabase } from './teardown-worker-database';

export async function setup(): Promise<void> {
  console.log('[Integration Tests] Setting up database schema...');
  await setupWorkerDatabase();
  console.log('[Integration Tests] Database schema ready');
}

export async function teardown(): Promise<void> {
  console.log('[Integration Tests] Tearing down database schema...');
  await teardownWorkerDatabase();
  console.log('[Integration Tests] Database schema cleaned up');
}
