import { asyncHanlder } from '@libs/async-handler';
import { RequestHandler } from 'express';
// import { renderToString } from 'vue/server-renderer';
// import { createVueApp } from './create-vue-app';

// Currently unable to render this in server mode due to the fact that there are ESM/CJS issues
// downstream in @apollo/client
//
// See issue for further details: https://github.com/vuejs/apollo/issues/1502
//
// When resolved downstream, uncomment all lines here to enable SSR again

const handler: RequestHandler = async (_req, res) => {
  // const { app, router } = createVueApp({ isServer: true });
  //
  // router.push(req.url);
  //
  // await router.isReady();
  // const html = await renderToString(app);
  const html = ''

  res.send(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
        <script type="module" src="/public/client.bundle.js"></script>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>`
  );
};

export const serverEntry = asyncHanlder(handler);
