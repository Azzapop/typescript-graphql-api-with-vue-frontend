import type { Router } from 'vue-router';
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router';
import HomePage from './pages/Home/HomePage.vue';
import NotFoundPage from './pages/NotFound/NotFoundPage.vue';
import NoAccessPage from './pages/auth/NoAccess/NoAccessPage.vue'
import PaintersPage from './pages/Painters/PaintersPage.vue';

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/painters',
    component: PaintersPage,
  },
  {
    path: '/pages/notfound',
    component: NotFoundPage,
  },
  {
    path: '/auth/access',
    component: NoAccessPage,
  }
];

export const createVueRouter = (opts: { isServer: boolean }): Router => {
  const { isServer } = opts;

  const history = isServer ? createMemoryHistory() : createWebHistory();

  return createRouter({
    history,
    routes,
  });
};
