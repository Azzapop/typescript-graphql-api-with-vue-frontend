<script setup lang="ts"></script>

<template>
  <div class="layout-footer">
    SAKAI by
    <a
      href="https://primevue.org"
      target="_blank"
      rel="noopener noreferrer"
      class="layout-footer__link"
      >PrimeVue</a
    >
  </div>
</template>

<style lang="scss">
.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0 1rem 0;
  gap: 0.5rem;
  border-top: 1px solid var(--surface-border);

  &__link {
    color: var(--p-primary-color);
    font-weight: 700;

    &:hover {
      text-decoration-line: underline;
    }
  }
}
</style>
