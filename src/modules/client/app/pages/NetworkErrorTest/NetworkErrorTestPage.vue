<script setup lang="ts">
import AppLayout from '@app/layout/App/AppLayout.vue';
import Button from 'primevue/button';
import { useNetworkErrorTest } from './use-network-error-test';

const { load, loading } = useNetworkErrorTest();

const triggerNetworkError = async () => {
  await load();
};
</script>

<template>
  <AppLayout>
    <div class="network-error-test">
      <h1 class="network-error-test__title">Network Error Test</h1>
      <p class="network-error-test__text">
        Click the button below to trigger a network error. This makes a GraphQL
        request with a special header (<code class="network-error-test__code"
          >x-trigger-network-error: true</code
        >) that causes the server to return a
        <code class="network-error-test__code">500</code> error.
      </p>
      <p class="network-error-test__text">
        The Apollo network error link should catch this and display the global
        error page with the trace token.
      </p>
      <Button
        label="Trigger Network Error"
        icon="pi pi-exclamation-triangle"
        severity="danger"
        :loading="loading"
        @click="triggerNetworkError"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss">
.network-error-test {
  padding: 2rem;

  &__title {
    margin-top: 0;
  }

  &__text {
    margin-bottom: 1rem;
  }

  &__code {
    background-color: var(--surface-100);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }
}
</style>
