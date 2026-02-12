import type { RouteRecordRaw } from 'vue-router';
import HomePage from './pages/Home/HomePage.vue';
import NotFoundPage from './pages/NotFound/NotFoundPage.vue';
import UserProfilePage from './pages/UserProfile/UserProfilePage.vue';
import ErrorPage from './pages/auth/Error/ErrorPage.vue';
import LoginPage from './pages/auth/Login/LoginPage.vue';
import NoAccessPage from './pages/auth/NoAccess/NoAccessPage.vue';

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
    name: 'not-found',
    path: '/pages/notfound',
    component: NotFoundPage,
    meta: { public: true },
  },
  {
    name: 'access',
    path: '/access',
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
] satisfies RouteRecordRaw[];

export const BASE_PATH = '/';
