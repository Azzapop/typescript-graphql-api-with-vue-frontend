<script setup lang="ts">
import AppLayout from '@app/layout/App/AppLayout.vue';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useTestError } from './use-test-error';

const triggered = ref(false);

const { result, loading, error, load } = useTestError();

const triggerGraphQLError = async () => {
  triggered.value = true;
  await load();
};
</script>

<template>
  <AppLayout>
    <div class="graphql-error-test">
      <h1 class="graphql-error-test__title">GraphQL Error Test</h1>
      <p class="graphql-error-test__text">
        Click the button below to trigger a GraphQL error. This makes a request
        to the
        <code class="graphql-error-test__code">testError</code> query which
        throws an
        <code class="graphql-error-test__code">INTERNAL_SERVER_ERROR</code>.
      </p>
      <p class="graphql-error-test__text">
        The Apollo GraphQL error link should catch this and display the global
        error page with the trace token.
      </p>
      <Button
        label="Trigger GraphQL Error"
        icon="pi pi-exclamation-triangle"
        severity="danger"
        :loading="loading"
        @click="triggerGraphQLError"
      />

      <div v-if="triggered" class="graphql-error-test__result">
        <h2 class="graphql-error-test__result-title">Result:</h2>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else-if="result">{{ result.testError }}</div>
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss">
.graphql-error-test {
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

  &__result {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid var(--surface-300);
    border-radius: 0.5rem;
  }

  &__result-title {
    margin-top: 0;
  }
}
</style>
