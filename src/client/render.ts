import { basename } from 'node:path';
import { renderToString } from 'vue/server-renderer';
import { createVueApp } from './create-vue-app';

// TODO split out to individual files
const renderPreloadLinks = (
  modules: string[] | undefined,
  manifest: Record<string, string[]>
) => {
  if (!modules) return '';
  let links = '';
  const seen = new Set();
  modules.forEach((id) => {
    const { [id]: files } = manifest;
    if (files) {
      files.forEach((file) => {
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

const renderStore = (storeData: unknown): string => {
  const dataString = JSON.stringify(storeData);

  return `<script>window.__app_store = '${dataString}';</script>`;
};

export const renderHtml = async (opts: {
  template: string;
  url: string;
  manifest: Record<string, string[]>;
}) => {
  const { template, url, manifest } = opts;

  const { app, router, store } = createVueApp({ isServer: true });

  await router.push(url);

  await router.isReady();

  // Create and pass a SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on context.modules. After the render, context.modules would contain all the
  // components that have been instantiated during this render call.
  const context: { modules?: string[] } = {};

  const preloadLinks = renderPreloadLinks(context.modules, manifest);

  const appHtml = await renderToString(app, context);

  // This must come after we render the app html so that our store is primed
  const appStore = renderStore(store.state.value);

  const html = template
    .replace(`<!--preload-links-->`, preloadLinks)
    .replace(`<!--app-store-->`, appStore)
    .replace(`<!--app-html-->`, appHtml);

  return html;
};
