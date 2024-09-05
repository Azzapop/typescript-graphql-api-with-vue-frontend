import { createVueApp } from './create-vue-app';

const { app } = createVueApp({ isServer: false });

app.mount('#app');
