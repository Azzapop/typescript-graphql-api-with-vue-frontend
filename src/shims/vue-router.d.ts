import type { ROUTES } from '@app/routes';
import 'vue-router';
import type { RouteRecordInfo } from 'vue-router';

type AppRouteName = (typeof ROUTES)[number]['name'] & string;

type AppRouteNamedMap = {
  [K in AppRouteName]: RouteRecordInfo<
    K,
    string,
    Record<never, never>,
    Record<never, never>
  >;
};

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean;
  }

  interface RouteNamedMap extends AppRouteNamedMap {}
}
