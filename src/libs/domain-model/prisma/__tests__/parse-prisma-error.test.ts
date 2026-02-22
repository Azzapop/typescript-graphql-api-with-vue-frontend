import { Prisma } from '@prisma/client';
import { describe, it, expect } from 'vitest';
import { parsePrismaError } from '../parse-prisma-error';

describe('parsePrismaError', () => {
  describe('when error is not a PrismaClientKnownRequestError', () => {
    it('returns UNKNOWN for generic Error', () => {
      const error = new Error('Something went wrong');
      const result = parsePrismaError(error);
      expect(result).toEqual({ code: 'UNKNOWN' });
    });

    it('returns UNKNOWN for string', () => {
      const result = parsePrismaError('error message');
      expect(result).toEqual({ code: 'UNKNOWN' });
    });

    it('returns UNKNOWN for null', () => {
      const result = parsePrismaError(null);
      expect(result).toEqual({ code: 'UNKNOWN' });
    });

    it('returns UNKNOWN for undefined', () => {
      const result = parsePrismaError(undefined);
      expect(result).toEqual({ code: 'UNKNOWN' });
    });

    it('returns UNKNOWN for plain object', () => {
      const result = parsePrismaError({ message: 'error' });
      expect(result).toEqual({ code: 'UNKNOWN' });
    });
  });

  describe('when error is P2002 (Unique constraint)', () => {
    it('returns UNIQUE_CONSTRAINT with field names from array', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['username', 'email'] },
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'UNIQUE_CONSTRAINT',
        fields: ['username', 'email'],
      });
    });

    it('returns UNIQUE_CONSTRAINT with single field', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['userId'] },
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'UNIQUE_CONSTRAINT',
        fields: ['userId'],
      });
    });

    it('returns empty fields array when target is not an array', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: 'username' }, // Not an array
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'UNIQUE_CONSTRAINT',
        fields: [],
      });
    });

    it('returns empty fields array when meta is undefined', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: undefined,
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'UNIQUE_CONSTRAINT',
        fields: [],
      });
    });

    it('returns empty fields array when target is missing', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: {},
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'UNIQUE_CONSTRAINT',
        fields: [],
      });
    });
  });

  describe('when error is P2003 (Foreign key constraint)', () => {
    it('returns FOREIGN_KEY_CONSTRAINT with field name', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '5.0.0',
          meta: { field_name: 'userId' },
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'FOREIGN_KEY_CONSTRAINT',
        field: 'userId',
      });
    });

    it('returns "unknown" field when field_name is not a string', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '5.0.0',
          meta: { field_name: 123 },
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'FOREIGN_KEY_CONSTRAINT',
        field: 'unknown',
      });
    });

    it('returns "unknown" field when field_name is null', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '5.0.0',
          meta: { field_name: null },
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'FOREIGN_KEY_CONSTRAINT',
        field: 'unknown',
      });
    });

    it('returns "unknown" field when meta is undefined', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '5.0.0',
          meta: undefined,
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'FOREIGN_KEY_CONSTRAINT',
        field: 'unknown',
      });
    });

    it('returns "unknown" field when field_name is missing', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed',
        {
          code: 'P2003',
          clientVersion: '5.0.0',
          meta: {},
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({
        code: 'FOREIGN_KEY_CONSTRAINT',
        field: 'unknown',
      });
    });
  });

  describe('when error is P2025 (Record not found)', () => {
    it('returns RECORD_NOT_FOUND', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.0.0',
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({ code: 'RECORD_NOT_FOUND' });
    });

    it('returns RECORD_NOT_FOUND with meta (meta is ignored)', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.0.0',
          meta: { cause: 'Record to delete does not exist.' },
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({ code: 'RECORD_NOT_FOUND' });
    });
  });

  describe('when error is unknown Prisma error code', () => {
    it('returns UNKNOWN for unhandled Prisma error', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Some other error',
        {
          code: 'P9999', // Unknown code
          clientVersion: '5.0.0',
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({ code: 'UNKNOWN' });
    });

    it('returns UNKNOWN for P2001 (not in our list)', () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'The record searched for in the where condition does not exist',
        {
          code: 'P2001',
          clientVersion: '5.0.0',
        }
      );

      const result = parsePrismaError(error);

      expect(result).toEqual({ code: 'UNKNOWN' });
    });
  });
});
