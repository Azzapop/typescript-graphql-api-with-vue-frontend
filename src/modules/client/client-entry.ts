import { createVueApp } from './app';

const { app, router, store } = createVueApp({ isServer: false });

await router.isReady();

if (window.__app_store) {
  store.state.value = JSON.parse(window.__app_store);
}

app.mount('#app');
