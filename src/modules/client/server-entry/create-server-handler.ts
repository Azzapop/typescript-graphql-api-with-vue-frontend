import type { RequestHandler } from 'express';
import type { ViteDevServer } from 'vite';
import { asyncHandler } from '~libs/async-handler';
import { renderHtml } from './render-html';

export const createServerHandler = (opts: {
  vite?: ViteDevServer;
  template: string;
  manifest?: Record<string, string[]>;
}): RequestHandler => {
  const { vite, template: baseTemplate, manifest } = opts;

  const handler: RequestHandler = async (req, res) => {
    try {
      const { originalUrl, user } = req;
      // Extract path from originalUrl (remove query string)
      const routePath = originalUrl.split('?')[0] ?? '/';

      let template = baseTemplate;
      if (vite) {
        // Only relevant for dev. Apply Vite HTML transforms. This injects the Vite
        // HMR client, and also applies HTML transforms from Vite plugins, e.g. global
        // preambles from @vitejs/plugin-vue
        template = await vite.transformIndexHtml(originalUrl, baseTemplate);
      }

      // Public routes (login, error pages, etc.) don't require authentication,
      // so user may be null even on successful requests
      const userId = user?.id ?? null;
      const html = await renderHtml({
        template,
        url: routePath,
        manifest,
        userId,
      });

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      // TODO this a little gross
      let msg: string | undefined = JSON.stringify(e);

      if (e instanceof Error) {
        if (vite) {
          vite.ssrFixStacktrace(e);
        }
        const { stack } = e;
        msg = stack;
      }

      res.status(500).end(msg);
    }
  };

  return asyncHandler(handler);
};
