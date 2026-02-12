import { Prisma } from '@prisma/client';

type PrismaError =
  | { code: 'UNIQUE_CONSTRAINT'; fields: string[] }
  | { code: 'FOREIGN_KEY_CONSTRAINT'; field: string }
  | { code: 'RECORD_NOT_FOUND' }
  | { code: 'UNKNOWN' };

export const parsePrismaError = (error: unknown): PrismaError => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return { code: 'UNKNOWN' };
  }

  switch (error.code) {
    case 'P2002': {
      const target = error.meta?.target;
      const fields = Array.isArray(target) ? target : [];
      return { code: 'UNIQUE_CONSTRAINT', fields };
    }
    case 'P2003': {
      const field =
        typeof error.meta?.field_name === 'string'
          ? error.meta.field_name
          : 'unknown';
      return { code: 'FOREIGN_KEY_CONSTRAINT', field };
    }
    case 'P2025':
      return { code: 'RECORD_NOT_FOUND' };
    default:
      return { code: 'UNKNOWN' };
  }
};
