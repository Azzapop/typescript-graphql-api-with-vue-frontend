import type { PrismaError } from '~database';
import { logger } from '~libs/logger';
import type { RepositoryError } from './repository-types';

type RepositoryErrorResult = { success: false; error: RepositoryError };

export const handleRepositoryError = (
  parsed: PrismaError
): RepositoryErrorResult => {
  switch (parsed.code) {
    case 'RECORD_NOT_FOUND':
      logger.error('[RECORD_NOT_FOUND]');
      return { success: false, error: 'NOT_FOUND' };
    case 'FOREIGN_KEY_CONSTRAINT':
      logger.error(`[FOREIGN_KEY_CONSTRAINT] field: ${parsed.field}`);
      return { success: false, error: 'FOREIGN_KEY_CONSTRAINT' };
    case 'UNIQUE_CONSTRAINT':
      logger.error(`[UNIQUE_CONSTRAINT] fields: ${parsed.fields.join(', ')}`);
      return { success: false, error: 'UNIQUE_CONSTRAINT' };
    case 'UNKNOWN':
      logger.error('[UNKNOWN]');
      return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
