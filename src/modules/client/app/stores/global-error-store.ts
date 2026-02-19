import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalErrorStore = defineStore('globalError', () => {
  const globalError = ref(false);
  const traceToken = ref<string | undefined>(undefined);

  const setGlobalError = (token?: string): void => {
    globalError.value = true;
    traceToken.value = token;
  };

  const clearGlobalError = (): void => {
    globalError.value = false;
    traceToken.value = undefined;
  };

  return { globalError, traceToken, setGlobalError, clearGlobalError };
});
