import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const userId = ref<string | null>(null);

  const isAuthenticated = computed(() => userId.value !== null);

  const setUser = (id: string | null): void => {
    userId.value = id;
  };

  return { userId, isAuthenticated, setUser };
});
