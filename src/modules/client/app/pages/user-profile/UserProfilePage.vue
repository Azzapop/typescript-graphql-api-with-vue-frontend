<script setup lang="ts">
import AppLayout from '@app/layout/App/AppLayout.vue';
import { useUserProfile } from './use-user-profile';

const { result, loading, error } = useUserProfile();
</script>

<template>
  <AppLayout>
    <div class="user-profile">
      <h1>User Profile</h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else-if="result">
        <p><strong>ID:</strong> {{ result.me.id }}</p>
        <p><strong>Email:</strong> {{ result.me.email }}</p>
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss">
.user-profile {
  padding: 2rem;
}
</style>
