import { renderToString } from 'vue/server-renderer';
import { createVueApp } from '../../app';
import { renderPreloadLinks } from './render-preload-links';
import { renderStoreData } from './render-store-data';

export const renderHtml = async (opts: {
  template: string;
  url: string;
  manifest?: Record<string, string[]>;
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

  // We need to render the app html itself first so that our modules and store are primed
  // for rendering
  const appHtml = await renderToString(app, context);

  let preloadLinks = '';
  if (context.modules && manifest) {
    preloadLinks = renderPreloadLinks(context.modules, manifest);
  }

  const appStore = renderStoreData(store.state.value);

  const html = template
    .replace(`<!--preload-links-->`, preloadLinks)
    .replace(`<!--app-store-->`, appStore)
    .replace(`<!--app-html-->`, appHtml);

  return html;
};
