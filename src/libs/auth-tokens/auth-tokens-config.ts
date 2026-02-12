import { createConfig } from '~libs/config';

export interface AuthTokensConfig {
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

export const authTokensConfig = createConfig<AuthTokensConfig>({
  JWT_ACCESS_SECRET: {
    doc: 'Secret key for signing access tokens',
    format: String,
    default: null,
    env: 'JWT_ACCESS_SECRET',
    sensitive: true,
  },
  JWT_REFRESH_SECRET: {
    doc: 'Secret key for signing refresh tokens',
    format: String,
    default: null,
    env: 'JWT_REFRESH_SECRET',
    sensitive: true,
  },
});
