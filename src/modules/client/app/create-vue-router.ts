import type { Router } from 'vue-router';
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router';
import HomePage from './pages/HomePage/HomePage.vue';
import NotFound from './pages/NotFound/NotFound.vue';
import NoAccess from './pages/auth/NoAccess/NoAccess.vue'
import PaintersPage from './pages/PaintersPage/PaintersPage.vue';

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
    component: NotFound,
  },
  {
    path: '/auth/access',
    component: NoAccess,
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
