import { ViteDevServer, createServer } from 'vite';

// Anything commented out is needed for the prod build

export const createViteServer = async (
  opts: {
    root?: string;
    env?: 'prod' | 'dev' | 'test';
    hmrPort?: number;
  } = {}
): Promise<ViteDevServer | undefined> => {
  if (opts.env === 'prod') return;
  const { root = process.cwd(), env = 'dev', hmrPort } = opts;

  return await createServer({
    base: '/public/',
    root,
    logLevel: env === 'test' ? 'error' : 'info',
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
