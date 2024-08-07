import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  Router,
} from 'vue-router';
import About from './pages/About.vue';
import Home from './pages/Home.vue';
import Folders from './pages/Folders.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/folders', component: Folders }
];

export const paths = routes.map(({ path }) => path);

export const createVueRouter = (opts: { isServer: boolean }): Router => {
  const { isServer } = opts;
  const history = isServer ? createMemoryHistory() : createWebHistory();
  return createRouter({
    history,
    routes,
  });
};
