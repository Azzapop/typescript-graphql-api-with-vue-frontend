import { createConfig } from '~libs/config';

export interface DatabaseConfig {
  DATABASE_URL: string;
}

export const databaseConfig = createConfig<DatabaseConfig>({
  DATABASE_URL: {
    doc: 'PostgreSQL database connection URL',
    format: String,
    default: null,
    env: 'DATABASE_URL',
    sensitive: true,
  },
});
