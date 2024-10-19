import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import graphqlLoader from 'vite-plugin-graphql-loader';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    vue(),
    graphqlLoader(),
  ],
  optimizeDeps: { exclude: ['fsevents'] },
  build: {
    target: 'esnext',
    manifest: false,
    minify: true,
    cssMinify: true,
  },
});
