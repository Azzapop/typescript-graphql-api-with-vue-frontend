<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import AboutPage from './pages/AboutPage.vue';

const count = ref(0);

const increment = () => {
  count.value++;
};
</script>
<template>
  Hello World!
  <button @click="increment">Count is: {{ count }}</button>
  <about-page></about-page>
  <RouterLink to="/">Go To Home</RouterLink>
  <RouterLink to="/about">Go To About</RouterLink>
  <RouterLink to="/painters">Go To Painters</RouterLink>
  <RouterLink to="/everything">Go To Everything</RouterLink>
  <RouterView></RouterView>
</template>
<style>
@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src:
    url('./assets/fonts/Inter-Italic.woff2#iefix') format('woff2'),
    url('./assets/fonts/Inter-Italic.woff') format('woff');
}
.inter {
  font-family: 'Inter';
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
