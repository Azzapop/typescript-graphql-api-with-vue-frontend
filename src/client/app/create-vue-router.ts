import type { Router } from 'vue-router';
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router';
import AboutPage from './pages/AboutPage.vue';
import EverythingPage from './pages/EverythingPage.vue';
import HomePage from './pages/HomePage.vue';
import PaintersPage from './pages/PaintersPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/painters', component: PaintersPage },
  { path: '/everything', component: EverythingPage },
];

export const createVueRouter = (opts: { isServer: boolean }): Router => {
  const { isServer } = opts;

  const history = isServer ? createMemoryHistory() : createWebHistory();

  return createRouter({
    history,
    routes,
  });
};
