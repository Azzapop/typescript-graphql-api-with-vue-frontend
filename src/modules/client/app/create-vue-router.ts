import type { Router } from 'vue-router';
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router';
import HomePage from './pages/Home/HomePage.vue';
import NotFoundPage from './pages/NotFound/NotFoundPage.vue';
import UserProfilePage from './pages/UserProfile/UserProfilePage.vue';
import ErrorPage from './pages/auth/Error/ErrorPage.vue';
import NoAccessPage from './pages/auth/NoAccess/NoAccessPage.vue';
import LoginPage from './pages/auth/login/LoginPage.vue';

const ROUTES = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/profile',
    component: UserProfilePage,
  },
  {
    path: '/pages/notfound',
    component: NotFoundPage,
  },
  {
    path: '/access',
    component: NoAccessPage,
  },
  {
    path: '/error',
    component: ErrorPage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
];

const BASE_PATH = '/app';

export const createVueRouter = (opts: { isServer: boolean }): Router => {
  const { isServer } = opts;

  const history = isServer
    ? createMemoryHistory(BASE_PATH)
    : createWebHistory(BASE_PATH);

  return createRouter({
    history,
    routes: ROUTES,
  });
};
