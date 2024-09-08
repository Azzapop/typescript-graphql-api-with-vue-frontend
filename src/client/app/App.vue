<script setup lang="ts">
import { ref, Suspense } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import About from './pages/About.vue';

const count = ref(0);

const increment = () => {
  count.value++;
};
</script>
<template>
  Hello World!
  <button @click="increment">Count is: {{ count }}</button>
  <about></about>
  <RouterLink to="/">Go To Home</RouterLink>
  <RouterLink to="/about">Go To About</RouterLink>
  <RouterLink to="/painters">Go To Painters</RouterLink>
  <Suspense>
    <RouterView></RouterView>
  </Suspense>
</template>
