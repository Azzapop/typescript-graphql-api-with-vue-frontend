import type { Router } from 'vue-router';
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router';
import AppLayout from './layout/AppLayout.vue';
import HomePage from './pages/HomePage/HomePage.vue';
import PaintersPage from './pages/PaintersPage/PaintersPage.vue';

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/',
        name: '',
        component: HomePage,
      },
      {
        path: '/painters',
        name: '',
        component: PaintersPage,
      },
    ],
  },
];

export const createVueRouter = (opts: { isServer: boolean }): Router => {
  const { isServer } = opts;

  const history = isServer ? createMemoryHistory() : createWebHistory();

  return createRouter({
    history,
    routes,
  });
};
