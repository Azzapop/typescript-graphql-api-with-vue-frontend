import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  Router,
} from 'vue-router';
import About from './pages/About.vue';
import Everything from './pages/Everything.vue';
import Home from './pages/Home.vue';
import Painters from './pages/Painters.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/painters', component: Painters },
  { path: '/everything', component: Everything },
];

export const createVueRouter = (opts: { isServer: boolean }): Router => {
  const { isServer } = opts;

  const history = isServer ? createMemoryHistory() : createWebHistory();

  return createRouter({
    history,
    routes,
  });
};
