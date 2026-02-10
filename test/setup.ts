/**
 * Global test setup.
 *
 * This file runs before all tests and configures the test environment.
 */

// Set required environment variables for tests
process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-chars-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars-long';
process.env.NODE_ENV = 'test';
