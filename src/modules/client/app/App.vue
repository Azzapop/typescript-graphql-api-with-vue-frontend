<script setup lang="ts">
import ErrorPage from '@app/pages/ErrorPage/ErrorPage.vue';
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { useGlobalErrorStore } from './stores/global-error-store';

const { globalError } = storeToRefs(useGlobalErrorStore());
</script>

<template>
  <ErrorPage v-if="globalError" />
  <RouterView v-else />
</template>
