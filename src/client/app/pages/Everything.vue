<script setup lang="ts">
import { reactive, defineAsyncComponent } from 'vue';
import Button from '../components/button';

const ImportType = load('ImportType');
const Foo = defineAsyncComponent(() =>
  import('../components/Foo').then((mod) => mod.Foo)
);
function load(file: any) {
  return defineAsyncComponent(() => import(`../components/${file}.vue`));
}
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
  <Foo />
  <p class="inter">this will be styled with a font-face</p>
  <p class="import-meta-url">{{ state.url }}</p>
  <p class="protocol">{{ state.protocol }}</p>
  <Button>CommonButton</Button>
  <div>
    encrypted message:
    <p class="encrypted-msg"></p>
  </div>

  <ImportType />
</template>
