import type { Request, Response, NextFunction } from 'express';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { asyncHanlder } from '../async-handler';

describe('asyncHanlder', () => {
  const mockReq = {} as Request;
  const mockRes = {} as Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockNext = vi.fn() as NextFunction;
  });

  describe('when the handler succeeds', () => {
    it('executes the handler and resolves', async () => {
      const handler = vi.fn().mockResolvedValue(undefined);
      const wrapped = asyncHanlder(handler);

      await wrapped(mockReq, mockRes, mockNext);

      expect(handler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns a promise', async () => {
      const handler = vi.fn().mockResolvedValue('some value');
      const wrapped = asyncHanlder(handler);

      const result = wrapped(mockReq, mockRes, mockNext);

      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('when the handler throws an error', () => {
    it('passes async errors to next()', async () => {
      const error = new Error('Handler error');
      const handler = vi.fn().mockRejectedValue(error);
      const wrapped = asyncHanlder(handler);

      await wrapped(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('when the handler is not a promise', () => {
    it('wraps non-promise return values in Promise.resolve', async () => {
      const handler = vi.fn().mockReturnValue('sync value');
      const wrapped = asyncHanlder(handler);

      await wrapped(mockReq, mockRes, mockNext);

      expect(handler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
