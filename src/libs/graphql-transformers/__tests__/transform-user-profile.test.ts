import { createMock } from '@golevelup/ts-vitest';
import { describe, it, expect } from 'vitest';
import type { UserProfile } from '@prisma/client';
import { transformUserProfile } from '../transform-user-profile';

describe('transformUserProfile', () => {
  describe('successful transformation', () => {
    it('transforms UserProfile to GraphQL UserProfile format', () => {
      const profile = createMock<UserProfile>({
        id: 'profile-123',
        email: 'test@example.com',
      });

      const result = transformUserProfile(profile);

      expect(result).toEqual({
        id: 'profile-123',
        email: 'test@example.com',
      });
    });

    it('includes all required fields', () => {
      const profile = createMock<UserProfile>();
      const result = transformUserProfile(profile);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
    });
  });

  describe('null and undefined handling', () => {
    it('converts null email to null', () => {
      const profile = createMock<UserProfile>({
        email: null as unknown as string,
      });
      const result = transformUserProfile(profile);

      expect(result?.email).toBeNull();
    });

    it('converts undefined email to null', () => {
      const profile = createMock<UserProfile>({
        email: undefined as unknown as string,
      });
      const result = transformUserProfile(profile);

      expect(result?.email).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles empty string email', () => {
      const profile = createMock<UserProfile>({ email: '' });
      const result = transformUserProfile(profile);

      // Empty string should be preserved, not converted to null
      expect(result?.email).toBe('');
    });

    it('preserves email with special characters', () => {
      const email = 'test+tag@example.co.uk';
      const profile = createMock<UserProfile>({ email });
      const result = transformUserProfile(profile);

      expect(result?.email).toBe(email);
    });
  });
});
