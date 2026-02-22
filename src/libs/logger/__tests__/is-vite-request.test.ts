import type { Request } from 'express';
import { describe, it, expect } from 'vitest';
import { isViteRequest } from '../is-vite-request';

const createMockRequest = (url: string): Request => {
  return { url } as Request;
};

describe('isViteRequest', () => {
  describe('when request URL matches Vite patterns', () => {
    it('returns true for @vite paths', () => {
      const req = createMockRequest('/@vite/client');
      expect(isViteRequest(req)).toBe(true);
    });

    it('returns true for src paths', () => {
      const req = createMockRequest('/src/main.ts');
      expect(isViteRequest(req)).toBe(true);
    });

    it('returns true for node_modules paths', () => {
      const req = createMockRequest('/node_modules/vue/dist/vue.js');
      expect(isViteRequest(req)).toBe(true);
    });

    it('returns true for @fs paths', () => {
      const req = createMockRequest('/@fs/Users/project/file.ts');
      expect(isViteRequest(req)).toBe(true);
    });

    it('returns true for @id paths', () => {
      const req = createMockRequest('/@id/vue');
      expect(isViteRequest(req)).toBe(true);
    });

    it('returns true for URLs containing "vite"', () => {
      const req = createMockRequest('/some/vite/path');
      expect(isViteRequest(req)).toBe(true);
    });

    it('returns true for source map files', () => {
      const req = createMockRequest('/app.js.map');
      expect(isViteRequest(req)).toBe(true);
    });
  });

  describe('when request URL does not match Vite patterns', () => {
    it('returns false for API routes', () => {
      const req = createMockRequest('/api/users');
      expect(isViteRequest(req)).toBe(false);
    });

    it('returns false for auth routes', () => {
      const req = createMockRequest('/auth/login');
      expect(isViteRequest(req)).toBe(false);
    });

    it('returns false for GraphQL routes', () => {
      const req = createMockRequest('/graphql');
      expect(isViteRequest(req)).toBe(false);
    });

    it('returns false for static assets from public', () => {
      const req = createMockRequest('/favicon.ico');
      expect(isViteRequest(req)).toBe(false);
    });

    it('returns false for root path', () => {
      const req = createMockRequest('/');
      expect(isViteRequest(req)).toBe(false);
    });
  });
});
