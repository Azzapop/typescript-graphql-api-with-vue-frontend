import { jwtVerify } from 'jose';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyRefreshToken } from '../verify-refresh-token';

// Mock the constants to avoid environment variable validation
vi.mock('../refresh-tokens-const', () => ({
  REFRESH_SECRET: new TextEncoder().encode('test-refresh-secret-key'),
  REFRESH_TTL_TIMESPAN: '7d',
  REFRESH_TTL_SECONDS: 7 * 24 * 60 * 60 * 1000,
}));

vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

const REFRESH_SECRET = new TextEncoder().encode('test-refresh-secret-key');

describe('verifyRefreshToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when given a valid token', () => {
    it('verifies the token with the refresh secret', async () => {
      const mockPayload = {
        sub: 'user-123',
        tokenVersion: 'token-version-456',
        refreshTokenId: 'refresh-token-789',
      };

      (jwtVerify as ReturnType<typeof vi.fn>).mockResolvedValue({
        payload: mockPayload,
      });

      await verifyRefreshToken('valid-token');

      expect(jwtVerify).toHaveBeenCalledWith('valid-token', REFRESH_SECRET);
    });

    it('returns success with the payload', async () => {
      const mockPayload = {
        sub: 'user-123',
        tokenVersion: 'token-version-456',
        refreshTokenId: 'refresh-token-789',
      };

      (jwtVerify as ReturnType<typeof vi.fn>).mockResolvedValue({
        payload: mockPayload,
      });

      const result = await verifyRefreshToken('valid-token');

      expect(result).toEqual({
        success: true,
        data: mockPayload,
      });
    });
  });

  describe('when given an invalid token', () => {
    it('returns an error', async () => {
      (jwtVerify as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Invalid token')
      );

      const result = await verifyRefreshToken('invalid-token');

      expect(result).toEqual({
        success: false,
        error: 'INVALID',
      });
    });
  });

  describe('when token verification throws', () => {
    it('catches the error and returns INVALID', async () => {
      (jwtVerify as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Token expired')
      );

      const result = await verifyRefreshToken('expired-token');

      expect(result).toEqual({
        success: false,
        error: 'INVALID',
      });
    });
  });
});
