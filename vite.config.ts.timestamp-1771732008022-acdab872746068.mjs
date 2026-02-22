// vite.config.ts
import { PrimeVueResolver } from "file:///Users/aaron/src/typescript-graphql-api-with-vue-frontend/node_modules/@primevue/auto-import-resolver/index.mjs";
import vue from "file:///Users/aaron/src/typescript-graphql-api-with-vue-frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///Users/aaron/src/typescript-graphql-api-with-vue-frontend/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///Users/aaron/src/typescript-graphql-api-with-vue-frontend/node_modules/vite/dist/node/index.js";
import graphqlLoader from "file:///Users/aaron/src/typescript-graphql-api-with-vue-frontend/node_modules/vite-plugin-graphql-loader/dist/index.js";
import tsconfigPaths from "file:///Users/aaron/src/typescript-graphql-api-with-vue-frontend/node_modules/vite-tsconfig-paths/dist/index.js";
var vite_config_default = defineConfig({
  base: "/",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWFyb24vc3JjL3R5cGVzY3JpcHQtZ3JhcGhxbC1hcGktd2l0aC12dWUtZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hYXJvbi9zcmMvdHlwZXNjcmlwdC1ncmFwaHFsLWFwaS13aXRoLXZ1ZS1mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWFyb24vc3JjL3R5cGVzY3JpcHQtZ3JhcGhxbC1hcGktd2l0aC12dWUtZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBQcmltZVZ1ZVJlc29sdmVyIH0gZnJvbSAnQHByaW1ldnVlL2F1dG8taW1wb3J0LXJlc29sdmVyJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgZ3JhcGhxbExvYWRlciBmcm9tICd2aXRlLXBsdWdpbi1ncmFwaHFsLWxvYWRlcic7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogJy8nLFxuICBwbHVnaW5zOiBbXG4gICAgdHNjb25maWdQYXRocyh7IGxvb3NlOiB0cnVlIH0pLFxuICAgIHZ1ZSgpLFxuICAgIGdyYXBocWxMb2FkZXIoKSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW1ByaW1lVnVlUmVzb2x2ZXIoKV0sXG4gICAgICBkdHM6ICdzcmMvc2hpbXMvY29tcG9uZW50cy5kLnRzJ1xuICAgIH0pLFxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHsgZXhjbHVkZTogWydmc2V2ZW50cyddIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBtYW5pZmVzdDogZmFsc2UsXG4gICAgbWluaWZ5OiB0cnVlLFxuICAgIGNzc01pbmlmeTogdHJ1ZSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgc2Nzczoge1xuICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInLCAvLyBvciBcIm1vZGVyblwiXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlYsU0FBUyx3QkFBd0I7QUFDOVgsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLGNBQWMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUFBLElBQzdCLElBQUk7QUFBQSxJQUNKLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztBQUFBLE1BQzlCLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxjQUFjLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRTtBQUFBLEVBQ3RDLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixLQUFLO0FBQUE7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
