<script setup lang="ts">
import { reactive } from 'vue';
import Button from '../components/button';

const state = reactive({
  count: 0,
  protocol: 'http',
  url: 'blah',
});
</script>

<style scoped>
h1,
a {
  color: green;
}
</style>
<template>
  <h1>Home</h1>
  <p>
    <img src="../assets/logo.png" alt="logo" />
  </p>
  <button @click="state.count++">count is: {{ state.count }}</button>
  <p class="inter">this will be styled with a font-face</p>
  <p class="import-meta-url">{{ state.url }}</p>
  <p class="protocol">{{ state.protocol }}</p>
  <Button>CommonButton</Button>
  <div>
    encrypted message:
    <p class="encrypted-msg"></p>
  </div>
</template>
