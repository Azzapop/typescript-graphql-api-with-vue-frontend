import { describe, it, expect } from 'vitest';
import { assert } from '../assert';

describe('assert', () => {
  describe('when given a non-null value', () => {
    it('does not throw for truthy values', () => {
      expect(() => assert(true)).not.toThrow();
      expect(() => assert(1)).not.toThrow();
      expect(() => assert('string')).not.toThrow();
      expect(() => assert({})).not.toThrow();
      expect(() => assert([])).not.toThrow();
    });

    it('does not throw for falsy but defined values', () => {
      expect(() => assert(false)).not.toThrow();
      expect(() => assert(0)).not.toThrow();
      expect(() => assert('')).not.toThrow();
    });
  });

  describe('when given null or undefined', () => {
    it('throws for null', () => {
      expect(() => assert(null)).toThrow('Expected value to be defined.');
    });

    it('throws for undefined', () => {
      expect(() => assert(undefined)).toThrow('Expected value to be defined.');
    });
  });

  describe('type narrowing', () => {
    it('narrows the type to non-nullable', () => {
      const value: string | null = 'test';
      assert(value);
      // Type assertion - if this compiles, the type narrowing works
      const _narrowed: string = value;
      expect(_narrowed).toBe('test');
    });
  });
});
