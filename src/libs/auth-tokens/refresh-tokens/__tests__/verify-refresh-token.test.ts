import { jwtVerify } from 'jose';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { REFRESH_SECRET } from '../refresh-tokens-const';
import { verifyRefreshToken } from '../verify-refresh-token';

vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

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
