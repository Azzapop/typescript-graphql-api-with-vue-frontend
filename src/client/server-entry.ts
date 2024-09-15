import { asyncHanlder } from '@libs/async-handler';
import type { RequestHandler } from 'express';
import { basename } from 'node:path';
import { renderToString } from 'vue/server-renderer';
import { createVueApp } from './create-vue-app';

const renderPreloadLinks = (modules: any, manifest: any) => {
  let links = '';
  const seen = new Set();
  modules.forEach((id: any) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file: any) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
};

const renderPreloadLink = (file: string): string => {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    // TODO
    return '';
  }
};
const handler: RequestHandler = async (req, res) => {
  const { app, router } = createVueApp({ isServer: true });

  router.push(req.url);

  await router.isReady();

  // Create and pass a SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on context.modules. After the render, context.modules would contain all the
  // components that have been instantiated during this render call.
  const context = {};
  const html = await renderToString(app, context);

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
