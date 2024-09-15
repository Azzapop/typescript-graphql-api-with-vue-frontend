import { asyncHanlder } from '@libs/async-handler';
import { RequestHandler } from 'express';
import { ViteDevServer } from 'vite';
import { renderHtml } from './server-entry/render';

export const serverHandler = (opts: {
  vite?: ViteDevServer;
  template: string;
  manifest?: Record<any, any>;
}): RequestHandler => {
  const { vite, template: baseTemplate, manifest } = opts;

  const handler: RequestHandler = async (req, res) => {
    try {
      const url = req.originalUrl;

      let template = baseTemplate;
      if (vite) {
        // Only relevant for dev. Apply Vite HTML transforms. This injects the Vite
        // HMR client, and also applies HTML transforms from Vite plugins, e.g. global
        // preambles from @vitejs/plugin-vue
        template = await vite.transformIndexHtml(url, baseTemplate);
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

  return asyncHanlder(handler);
};
