<script setup lang="ts">
import { defineStore } from 'pinia';
import { ref, onServerPrefetch, onMounted } from 'vue';
import { GetPaintersQuery } from '../../../services/graphql/types';
import { usePainters } from './usePainters';

const usePaintersStore = defineStore('painters', () => {
  const painters = ref<GetPaintersQuery['painters'] | null>(null);

  const loadData = async () => {
    const query = await usePainters();
    query.onResult((result) => {
      painters.value = result.data?.painters;
    });
  };

  return { painters, loadData };
});

const store = usePaintersStore();

onServerPrefetch(async () => {
  await store.loadData();
});

onMounted(async () => {
  if (store.painters === null) {
    await store.loadData();
  }
});
</script>
<template v-if="store.painters !== null">
  <div v-for="painter in store.painters" v-bind:key="painter?.name">
    <p>{{ painter?.name }}</p>
  </div>
</template>
