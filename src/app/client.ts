import { createVueApp } from './app';

const { app } = createVueApp({ isServer: false });

app.mount('#app');
