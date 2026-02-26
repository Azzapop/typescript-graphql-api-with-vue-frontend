import type { RouteRecordRaw } from 'vue-router';
import ErrorPage from './pages/ErrorPage/ErrorPage.vue';
import GraphQLErrorTestPage from './pages/GraphQLErrorTest/GraphQLErrorTestPage.vue';
import GraphQLSSRErrorTestPage from './pages/GraphQLSSRErrorTest/GraphQLSSRErrorTestPage.vue';
import HomePage from './pages/Home/HomePage.vue';
import NetworkErrorTestPage from './pages/NetworkErrorTest/NetworkErrorTestPage.vue';
import NoAccessPage from './pages/NoAccess/NoAccessPage.vue';
import NotFoundPage from './pages/NotFound/NotFoundPage.vue';
import UserProfilePage from './pages/UserProfile/UserProfilePage.vue';
import LoginPage from './pages/auth/login/LoginPage.vue';

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
