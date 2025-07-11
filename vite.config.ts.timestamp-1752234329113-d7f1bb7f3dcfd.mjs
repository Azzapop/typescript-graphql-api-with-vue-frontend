// vite.config.ts
import { PrimeVueResolver } from "file:///Users/aaron/src/personal/typescript-graphql-api-with-vue-frontend/node_modules/@primevue/auto-import-resolver/index.mjs";
import vue from "file:///Users/aaron/src/personal/typescript-graphql-api-with-vue-frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///Users/aaron/src/personal/typescript-graphql-api-with-vue-frontend/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///Users/aaron/src/personal/typescript-graphql-api-with-vue-frontend/node_modules/vite/dist/node/index.js";
import graphqlLoader from "file:///Users/aaron/src/personal/typescript-graphql-api-with-vue-frontend/node_modules/vite-plugin-graphql-loader/dist/index.js";
import tsconfigPaths from "file:///Users/aaron/src/personal/typescript-graphql-api-with-vue-frontend/node_modules/vite-tsconfig-paths/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    tsconfigPaths({ loose: true }),
    vue(),
    graphqlLoader(),
    Components({
      resolvers: [PrimeVueResolver()],
      dts: "src/shims/components.d.ts"
    })
  ],
  optimizeDeps: { exclude: ["fsevents"] },
  build: {
    target: "esnext",
    manifest: false,
    minify: true,
    cssMinify: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
        // or "modern"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWFyb24vc3JjL3BlcnNvbmFsL3R5cGVzY3JpcHQtZ3JhcGhxbC1hcGktd2l0aC12dWUtZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hYXJvbi9zcmMvcGVyc29uYWwvdHlwZXNjcmlwdC1ncmFwaHFsLWFwaS13aXRoLXZ1ZS1mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWFyb24vc3JjL3BlcnNvbmFsL3R5cGVzY3JpcHQtZ3JhcGhxbC1hcGktd2l0aC12dWUtZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBQcmltZVZ1ZVJlc29sdmVyIH0gZnJvbSAnQHByaW1ldnVlL2F1dG8taW1wb3J0LXJlc29sdmVyJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgZ3JhcGhxbExvYWRlciBmcm9tICd2aXRlLXBsdWdpbi1ncmFwaHFsLWxvYWRlcic7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHRzY29uZmlnUGF0aHMoeyBsb29zZTogdHJ1ZSB9KSxcbiAgICB2dWUoKSxcbiAgICBncmFwaHFsTG9hZGVyKCksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtQcmltZVZ1ZVJlc29sdmVyKCldLFxuICAgICAgZHRzOiAnc3JjL3NoaW1zL2NvbXBvbmVudHMuZC50cydcbiAgICB9KSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7IGV4Y2x1ZGU6IFsnZnNldmVudHMnXSB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWFuaWZlc3Q6IGZhbHNlLFxuICAgIG1pbmlmeTogdHJ1ZSxcbiAgICBjc3NNaW5pZnk6IHRydWUsXG4gIH0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJywgLy8gb3IgXCJtb2Rlcm5cIlxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdYLFNBQVMsd0JBQXdCO0FBQ3paLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxjQUFjLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFBQSxJQUM3QixJQUFJO0FBQUEsSUFDSixjQUFjO0FBQUEsSUFDZCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsaUJBQWlCLENBQUM7QUFBQSxNQUM5QixLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsY0FBYyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUU7QUFBQSxFQUN0QyxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osS0FBSztBQUFBO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
