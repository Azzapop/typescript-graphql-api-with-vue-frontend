import { createConfig } from '~libs/config';

export interface ServerConfig {
  PORT: number;
}

export const serverConfig = createConfig<ServerConfig>({
  PORT: {
    doc: 'Port to bind the server to',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
});
