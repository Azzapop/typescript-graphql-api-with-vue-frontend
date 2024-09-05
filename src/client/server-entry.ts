import { asyncHanlder } from '@libs/async-handler';
import { RequestHandler } from 'express';
import { renderToString } from 'vue/server-renderer';
import { createVueApp } from './create-vue-app';

const handler: RequestHandler = async (req, res) => {
  const { app, router } = createVueApp({ isServer: true });

  router.push(req.url);

  await router.isReady();
  const html = await renderToString(app);

  res.send(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
        <script type="importmap">
          {
            "imports": {
              "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
            }
          }
        </script>
        <script type="module" src="/public/client.bundle.js"></script>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>`
  );
};

export const serverEntry = asyncHanlder(handler);
