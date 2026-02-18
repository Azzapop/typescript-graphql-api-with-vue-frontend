import { createConfig } from '~libs/config';

export interface DomainModelConfig {
  DATABASE_URL: string;
}

export const domainModelConfig = createConfig<DomainModelConfig>({
  DATABASE_URL: {
    doc: 'PostgreSQL database connection URL',
    format: String,
    default: null,
    env: 'DATABASE_URL',
    sensitive: true,
  },
});
