<script setup lang="ts">
import AppLayout from '@app/layout/App/AppLayout.vue';
import Button from 'primevue/button';

const t = '123';
</script>
<template>
  <AppLayout>
    <p>Home {{ t }}</p>
    <Button label="Submit" />
  </AppLayout>
</template>
