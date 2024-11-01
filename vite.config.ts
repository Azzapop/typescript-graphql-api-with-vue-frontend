import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import graphqlLoader from 'vite-plugin-graphql-loader';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({ loose: true }),
    vue(),
    graphqlLoader(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ],
  optimizeDeps: { exclude: ['fsevents'] },
  build: {
    target: 'esnext',
    manifest: false,
    minify: true,
    cssMinify: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern"
      },
    },
  },
});
