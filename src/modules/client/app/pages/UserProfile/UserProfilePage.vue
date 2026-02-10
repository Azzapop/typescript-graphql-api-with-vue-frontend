<script setup lang="ts">
import AppLayout from '@app/layout/App/AppLayout.vue';
import { defineStore } from 'pinia';
import { ref, onServerPrefetch, onMounted } from 'vue';
import { useUserProfile } from './use-user-profile';
import type { GqlMeQuery } from './use-user-profile.gql';

const useProfileStore = defineStore('userProfile', () => {
  const profile = ref<GqlMeQuery['me'] | null>(null);

  const loadProfile = async () => {
    const query = await useUserProfile();
    query.onResult((result) => {
      profile.value = result.data?.me ?? null;
    });
  };

  return { profile, loadProfile };
});

const store = useProfileStore();

onServerPrefetch(async () => {
  await store.loadProfile();
});

onMounted(async () => {
  if (store.profile === null) {
    await store.loadProfile();
  }
});
</script>

<template>
  <AppLayout>
    <div v-if="store.profile">
      <h1>My Profile</h1>
      <p>Email: {{ store.profile.email }}</p>
    </div>
  </AppLayout>
</template>
