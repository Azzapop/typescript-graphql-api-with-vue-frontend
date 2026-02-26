<script setup lang="ts">
import AppLayout from '@app/layout/App/AppLayout.vue';
import { useSsrTestError } from './use-ssr-test-error';

const { result, loading, error } = useSsrTestError();
</script>

<template>
  <AppLayout>
    <div class="graphql-ssr-error-test">
      <h1 class="graphql-ssr-error-test__title">GraphQL SSR Error Test</h1>
      <p class="graphql-ssr-error-test__text">
        This page uses
        <code class="graphql-ssr-error-test__code">useQuery</code> instead of
        <code class="graphql-ssr-error-test__code">useLazyQuery</code>, which
        means the query executes immediately when the page loads, including
        during server-side rendering (SSR).
      </p>
      <p class="graphql-ssr-error-test__text">
        The query calls
        <code class="graphql-ssr-error-test__code">testError</code> which has a
        5 second delay, then throws an
        <code class="graphql-ssr-error-test__code">INTERNAL_SERVER_ERROR</code>.
      </p>
      <p class="graphql-ssr-error-test__text">
        <strong class="graphql-ssr-error-test__warning"
          >Testing SSR error handling:</strong
        >
        Open this page directly in a new tab or refresh the page. During SSR,
        the server waits for the query to complete (5 seconds), then renders the
        error page. You should see a blank/loading page for 5 seconds, then the
        error page - you should NOT see this content.
      </p>
      <p class="graphql-ssr-error-test__text">
        <strong class="graphql-ssr-error-test__warning"
          >Testing client-side error handling:</strong
        >
        Navigate to this page using the router (e.g., from another page in the
        app). You will see this content and the loading state below for 5
        seconds while the query executes, then the error page will appear.
      </p>

      <div class="graphql-ssr-error-test__result">
        <h2 class="graphql-ssr-error-test__result-title">Query Result:</h2>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else-if="result">Result: {{ result.testError }}</div>
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss">
.graphql-ssr-error-test {
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

  &__warning {
    font-weight: 700;
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
