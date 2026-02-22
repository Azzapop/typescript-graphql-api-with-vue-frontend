import { createTestUserProfile } from '#test/factories';
import { describe, it, expect } from 'vitest';
import { transformUserProfile } from '../transform-user-profile';

describe('transformUserProfile', () => {
  describe('successful transformation', () => {
    it('transforms UserProfile to GraphQL UserProfile format', () => {
      const profile = createTestUserProfile({
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
      const profile = createTestUserProfile();
      const result = transformUserProfile(profile);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
    });
  });

  describe('null and undefined handling', () => {
    it('converts null email to null', () => {
      const profile = createTestUserProfile({ email: null });
      const result = transformUserProfile(profile);

      expect(result?.email).toBeNull();
    });

    it('converts undefined email to null', () => {
      const profile = createTestUserProfile({ email: null });
      // Simulate undefined by deleting the property
      const profileWithUndefined = { ...profile, email: undefined };
      const result = transformUserProfile(
        profileWithUndefined as typeof profile
      );

      expect(result?.email).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles empty string email', () => {
      const profile = createTestUserProfile({ email: '' });
      const result = transformUserProfile(profile);

      // Empty string should be preserved, not converted to null
      expect(result?.email).toBe('');
    });

    it('preserves email with special characters', () => {
      const email = 'test+tag@example.co.uk';
      const profile = createTestUserProfile({ email });
      const result = transformUserProfile(profile);

      expect(result?.email).toBe(email);
    });
  });
});
