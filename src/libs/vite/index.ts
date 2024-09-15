import { ViteDevServer, createServer } from 'vite';

// Anything commented out is needed for the prod build

export const createViteServer = async (
  opts: {
    root?: string;
    hmrPort?: number;
  } = {}
): Promise<ViteDevServer> => {
  const { root = process.cwd(), hmrPort } = opts;

  return await createServer({
    base: '/public/',
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
