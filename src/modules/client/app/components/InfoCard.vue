<script setup lang="ts">
import { useLayout } from '@app/layout/composables/layout';
import type { PropType } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  preTitle: String,
  icon: String,
  severity: {
    type: String as PropType<'primary' | 'warn' | 'danger'>,
    default: 'primary',
    validator: (val: string) => ['primary', 'warn', 'danger'].includes(val),
  },
  buttonLabel: String,
  buttonTo: String,
});

const { isDarkTheme } = useLayout();
</script>

<template>
  <div
    class="info-card"
    :class="[`info-card--${severity}`, { 'info-card--dark': isDarkTheme }]"
  >
    <div class="info-card__inner">
      <div class="info-card__content">
        <template v-if="icon">
          <div class="info-card__icon-container">
            <i :class="['info-card__icon', icon]"></i>
          </div>
        </template>
        <template v-else>
          <slot name="icon"></slot>
        </template>
        <span v-if="preTitle" class="info-card__pre-title">{{ preTitle }}</span>
        <h1 class="info-card__title">{{ title }}</h1>
        <span v-if="subtitle" class="info-card__subtitle">{{ subtitle }}</span>
        <slot></slot>
        <Button
          v-if="buttonLabel && buttonTo"
          as="router-link"
          :label="buttonLabel"
          :to="buttonTo"
          :severity="severity"
          class="info-card__button"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.info-card {
  border-radius: 56px;
  padding: 0.3rem;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--primary-color), transparent 60%) 10%,
    var(--surface-ground) 30%
  );

  &--warn {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--warn-color-muted), transparent 60%) 10%,
      var(--surface-ground) 30%
    );
  }

  &--danger {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--danger-color-muted, #f87171), transparent 60%) 10%,
      var(--surface-ground) 30%
    );
  }

  &--dark .info-card__inner {
    background-color: var(--p-surface-900);
  }

  &__inner {
    border-radius: 53px;
    padding: 5rem 2rem;
    background-color: var(--p-surface-0);
    align-items: center;
    flex-direction: column;
    width: 100%;
    display: flex;
    @media (min-width: 576px) {
      padding-left: 5rem;
      padding-right: 5rem;
    }
  }

  &__content {
    align-items: center;
    flex-direction: column;
    display: flex;
    gap: 1rem;
  }

  &__icon-container {
    width: 3.2rem;
    height: 3.2rem;
    border-color: var(--p-primary-color);
    border-width: 2px;
    border-radius: 9999px;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  &--warn &__icon-container {
    border-color: rgb(249, 115, 22);
  }
  &--danger &__icon-container {
    border-color: rgb(220, 38, 38);
  }

  &__icon {
    color: var(--p-primary-color);
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }
  &--warn &__icon {
    color: rgb(249, 115, 22);
  }
  &--danger &__icon {
    color: rgb(220, 38, 38);
  }

  &__pre-title {
    color: var(--p-primary-color);
    font-weight: 700;
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  &__title {
    font-weight: 700;
    font-size: 1.875rem;
    line-height: 2.25rem;
    margin-bottom: 0.5rem;
    margin-top: 0;
    @media (min-width: 992px) {
      font-size: 3rem;
      line-height: 1;
    }
  }
  &__subtitle {
    color: var(--p-text-muted-color);
    margin-bottom: 2rem;
  }
  &__button {
    text-align: center;
    margin-top: 2rem;
  }
}
</style> 
