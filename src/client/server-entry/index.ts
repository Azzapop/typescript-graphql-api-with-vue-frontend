import { asyncHanlder } from '@libs/async-handler';
import { createViteServer } from '@libs/vite';
import type { RequestHandler } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import type { ViteDevServer } from 'vite';
import { renderHtml } from './render';
import { template as baseTemplate } from './template';

type ServerEntryDetails = {
  vite?: ViteDevServer;
  serverHandler: RequestHandler;
};

const resolve = (p: string) => path.resolve(__dirname, p);

export const serverEntry = async (
  opts: { env?: 'prod' | 'dev' | 'test' } = {}
): Promise<ServerEntryDetails> => {
  const { env = 'dev' } = opts;

  const vite = await createViteServer();

  const manifest =
    env === 'prod'
      ? JSON.parse(
          fs.readFileSync(
            resolve('dist/client/.vite/ssr-manifest.json'),
            'utf-8'
          )
        )
      : {};

  const handler: RequestHandler = async (req, res) => {
    try {
      const url = req.originalUrl.replace('/public/', '/');

      let template;
      if (vite) {
        // Apply Vite HTML transforms. This injects the Vite HMR client,
        // and also applies HTML transforms from Vite plugins, e.g. global
        // preambles from @vitejs/plugin-vue
        template = await vite.transformIndexHtml(url, baseTemplate);
      } else {
        template = baseTemplate;
      }

      const html = await renderHtml({ template, url, manifest });

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      let msg: string | undefined = JSON.stringify(e);
      if (e instanceof Error) {
        if (vite) {
          vite.ssrFixStacktrace(e);
        }
        msg = e.stack;
      }
      console.log(msg);
      res.status(500).end(msg);
    }
  };

  const serverHandler = asyncHanlder(handler);

  return { vite, serverHandler };
};
