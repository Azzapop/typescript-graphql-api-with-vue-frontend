<script setup lang="ts">
import AppLayout from '@app/layout/AppLayout/AppLayout.vue';
import { defineStore } from 'pinia';
import { ref, onServerPrefetch, onMounted } from 'vue';
import { usePainters } from './use-painters';
import type { GqlGetPaintersQuery } from './use-painters.gql';

const usePaintersStore = defineStore('painters', () => {
  const painters = ref<GqlGetPaintersQuery['painters'] | null>(null);

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
  <AppLayout>
    <div v-for="painter in store.painters" v-bind:key="painter?.name">
      <p>{{ painter?.name }}</p>
    </div>
  </AppLayout>
</template>
