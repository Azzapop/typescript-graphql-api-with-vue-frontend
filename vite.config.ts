import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import viteRestart from 'vite-plugin-restart';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), vue()],
  optimizeDeps: { exclude: ['fsevents'] },
  build: {
    // generate .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: 'src/index.ts',
    },
  },
});
