import { jwtVerify } from 'jose';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ACCESS_SECRET } from '../access-tokens-const';
import { verifyAccessToken } from '../verify-access-token';

vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

describe('verifyAccessToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when given a valid token', () => {
    it('verifies the token with the access secret', async () => {
      const mockPayload = {
        sub: 'user-123',
        tokenVersion: 'token-version-456',
      };

      (jwtVerify as ReturnType<typeof vi.fn>).mockResolvedValue({
        payload: mockPayload,
      });

      await verifyAccessToken('valid-token');

      expect(jwtVerify).toHaveBeenCalledWith('valid-token', ACCESS_SECRET);
    });

    it('returns success with the payload', async () => {
      const mockPayload = {
        sub: 'user-123',
        tokenVersion: 'token-version-456',
      };

      (jwtVerify as ReturnType<typeof vi.fn>).mockResolvedValue({
        payload: mockPayload,
      });

      const result = await verifyAccessToken('valid-token');

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

      const result = await verifyAccessToken('invalid-token');

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

      const result = await verifyAccessToken('expired-token');

      expect(result).toEqual({
        success: false,
        error: 'INVALID',
      });
    });
  });
});
