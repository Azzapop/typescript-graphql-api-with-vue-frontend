import { createMock } from '@golevelup/ts-vitest';
import { SignJWT } from 'jose';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { User } from '@prisma/client';
import { ACCESS_SECRET, ACCESS_TTL_TIMESPAN } from '../access-tokens-const';
import { signAccessToken } from '../sign-access-token';

vi.mock('jose', () => ({
  SignJWT: vi.fn(),
}));

describe('signAccessToken', () => {
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

  describe('when given a valid user', () => {
    it('creates a JWT with the correct payload', async () => {
      const user = createMock<User>({
        id: 'user-123',
        tokenVersion: 'token-version-456',
      });

      mockSign.mockResolvedValue('signed-token-string');

      await signAccessToken(user);

      expect(SignJWT).toHaveBeenCalledWith({
        tokenVersion: 'token-version-456',
      });
    });

    it('sets the subject to the user ID', async () => {
      const user = createMock<User>({ id: 'user-123' });

      mockSign.mockResolvedValue('signed-token-string');

      await signAccessToken(user);

      expect(mockSetSubject).toHaveBeenCalledWith('user-123');
    });

    it('sets the expiration time correctly', async () => {
      const user = createMock<User>();

      mockSign.mockResolvedValue('signed-token-string');

      await signAccessToken(user);

      expect(mockSetExpirationTime).toHaveBeenCalledWith(ACCESS_TTL_TIMESPAN);
    });

    it('sets the protected header with HS256 algorithm', async () => {
      const user = createMock<User>();

      mockSign.mockResolvedValue('signed-token-string');

      await signAccessToken(user);

      expect(mockSetProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
    });

    it('signs with the access secret', async () => {
      const user = createMock<User>();

      mockSign.mockResolvedValue('signed-token-string');

      await signAccessToken(user);

      expect(mockSign).toHaveBeenCalledWith(ACCESS_SECRET);
    });

    it('returns the signed token', async () => {
      const user = createMock<User>();

      mockSign.mockResolvedValue('signed-token-string');

      const result = await signAccessToken(user);

      expect(result).toBe('signed-token-string');
    });
  });
});
