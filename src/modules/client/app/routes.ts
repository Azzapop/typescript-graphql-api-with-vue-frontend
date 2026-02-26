import type { RouteRecordRaw } from 'vue-router';
import GraphQLSSRErrorTestPage from './pages/error-testing/graphql-ssr/GraphQLSSRErrorTestPage.vue';
import GraphQLErrorTestPage from './pages/error-testing/graphql/GraphQLErrorTestPage.vue';
import NetworkErrorTestPage from './pages/error-testing/network/NetworkErrorTestPage.vue';
import ErrorPage from './pages/error/ErrorPage.vue';
import HomePage from './pages/home/HomePage.vue';
import LoginPage from './pages/login/LoginPage.vue';
import NoAccessPage from './pages/no-access/NoAccessPage.vue';
import NotFoundPage from './pages/not-found/NotFoundPage.vue';
import UserProfilePage from './pages/user-profile/UserProfilePage.vue';

export const ROUTES = [
  {
    name: 'home',
    path: '/',
    component: HomePage,
  },
  {
    name: 'user-profile',
    path: '/user-profile',
    component: UserProfilePage,
  },
  {
    name: 'network-error-test',
    path: '/error-testing/network',
    component: NetworkErrorTestPage,
  },
  {
    name: 'graphql-error-test',
    path: '/error-testing/graphql',
    component: GraphQLErrorTestPage,
  },
  {
    name: 'graphql-ssr-error-test',
    path: '/error-testing/graphql-ssr',
    component: GraphQLSSRErrorTestPage,
  },
  {
    name: 'not-found',
    path: '/not-found',
    component: NotFoundPage,
    meta: { public: true },
  },
  {
    name: 'no-access',
    path: '/no-access',
    component: NoAccessPage,
    meta: { public: true },
  },
  {
    name: 'error',
    path: '/error',
    component: ErrorPage,
    meta: { public: true },
  },
  {
    name: 'login',
    path: '/login',
    component: LoginPage,
    meta: { public: true },
  },
  // Catch all to display not found
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage,
  },
] satisfies RouteRecordRaw[];

export const BASE_PATH = '/';
