import type { ViteDevServer } from 'vite';
import { createServer } from 'vite';

export const createViteServer = async (
  opts: {
    root?: string;
    hmrPort?: number;
  } = {}
): Promise<ViteDevServer> => {
  const { root = process.cwd(), hmrPort } = opts;

  return await createServer({
    base: '/app',
    root,
    logLevel: 'error', // TODO config this
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: {
        port: hmrPort,
      },
    },
    appType: 'custom',
  });
};
