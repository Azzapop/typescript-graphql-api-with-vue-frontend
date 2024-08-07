<script setup lang="ts">
import { ref } from 'vue';
import { apiClient } from '../api-client';

const data: any = ref([]);
const {
  data: { folders },
} = await apiClient.getFolders({ limit: 10 });
data.value = folders;
</script>
<template>
  <div v-for="folder in data">
    <p>{{ folder.name }}</p>
  </div>
</template>
