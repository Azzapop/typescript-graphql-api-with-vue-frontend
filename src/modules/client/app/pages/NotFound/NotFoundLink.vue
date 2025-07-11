<script setup lang="ts">
defineProps<{
  to: string;
  icon: string; // e.g. 'pi-table', 'pi-question-circle', etc.
  title: string;
  subtext: string;
}>();
</script>

<template>
  <router-link :to="to" class="not-found-link">
    <span class="not-found-link__icon-box">
      <i :class="`not-found-link__icon pi ${icon}`"></i>
    </span>
    <span class="not-found-link__content">
      <span class="not-found-link__title">{{ title }}</span>
      <span class="not-found-link__subtext">{{ subtext }}</span>
    </span>
  </router-link>
</template>

<style scoped lang="scss">
.not-found-link {
  align-items: center;
  width: 100%;
  display: flex;

  &__icon-box {
    height: 3.5rem;
    width: 3.5rem;
    border-radius: var(--p-content-border-radius);
    border-color: var(--p-primary-color);
    color: var(--p-primary-color);
    border-width: 2px;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  &__icon {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }

  &__content {
    flex-direction: column;
    display: flex;
    margin-left: 1.5rem;
  }

  &__title {
    font-weight: 500;
    display: block;

    @media (min-width: 992px) {
      font-size: 1.5rem;
      line-height: 1.75rem;
    }
  }

  &__subtext {
    color: var(--text-color-secondary);

    @media (min-width: 992px) {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
  }
}
</style> 