import { createMock } from '@golevelup/ts-vitest';
import { SignJWT } from 'jose';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RefreshToken, User } from '~libs/domain-model';
import { REFRESH_SECRET, REFRESH_TTL_TIMESPAN } from '../refresh-tokens-const';
import { signRefreshToken } from '../sign-refresh-token';

vi.mock('jose', () => ({
  SignJWT: vi.fn(),
}));

describe('signRefreshToken', () => {
  const mockSign = vi.fn();
  const mockSetProtectedHeader = vi.fn();
  const mockSetExpirationTime = vi.fn();
  const mockSetSubject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Chain the methods
    mockSetSubject.mockReturnValue({
      setExpirationTime: mockSetExpirationTime,
    });
    mockSetExpirationTime.mockReturnValue({
      setProtectedHeader: mockSetProtectedHeader,
    });
    mockSetProtectedHeader.mockReturnValue({
      sign: mockSign,
    });

    // Mock SignJWT constructor
    (SignJWT as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      setSubject: mockSetSubject,
    }));
  });

  describe('when given a valid user and refresh token', () => {
    it('creates a JWT with the correct payload', async () => {
      const user = createMock<User>({
        id: 'user-123',
        tokenVersion: 'token-version-456',
      });
      const refreshToken = createMock<RefreshToken>({
        id: 'refresh-token-789',
      });

      mockSign.mockResolvedValue('signed-token-string');

      await signRefreshToken(user, refreshToken);

      expect(SignJWT).toHaveBeenCalledWith({
        tokenVersion: 'token-version-456',
        refreshTokenId: 'refresh-token-789',
      });
    });

    it('sets the subject to the user ID', async () => {
      const user = createMock<User>({ id: 'user-123' });
      const refreshToken = createMock<RefreshToken>();

      mockSign.mockResolvedValue('signed-token-string');

      await signRefreshToken(user, refreshToken);

      expect(mockSetSubject).toHaveBeenCalledWith('user-123');
    });

    it('sets the expiration time correctly', async () => {
      const user = createMock<User>();
      const refreshToken = createMock<RefreshToken>();

      mockSign.mockResolvedValue('signed-token-string');

      await signRefreshToken(user, refreshToken);

      expect(mockSetExpirationTime).toHaveBeenCalledWith(REFRESH_TTL_TIMESPAN);
    });

    it('sets the protected header with HS256 algorithm', async () => {
      const user = createMock<User>();
      const refreshToken = createMock<RefreshToken>();

      mockSign.mockResolvedValue('signed-token-string');

      await signRefreshToken(user, refreshToken);

      expect(mockSetProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
    });

    it('signs with the refresh secret', async () => {
      const user = createMock<User>();
      const refreshToken = createMock<RefreshToken>();

      mockSign.mockResolvedValue('signed-token-string');

      await signRefreshToken(user, refreshToken);

      expect(mockSign).toHaveBeenCalledWith(REFRESH_SECRET);
    });

    it('returns the signed token', async () => {
      const user = createMock<User>();
      const refreshToken = createMock<RefreshToken>();

      mockSign.mockResolvedValue('signed-token-string');

      const result = await signRefreshToken(user, refreshToken);

      expect(result).toBe('signed-token-string');
    });
  });
});
