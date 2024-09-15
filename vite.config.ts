import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), vue()],
  optimizeDeps: { exclude: ['fsevents'] },
  build: {
    manifest: false,
    minify: true,
    cssMinify: true,
  },
});
