<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  preTitle?: string;
  icon?: string; // icon class, e.g. 'pi pi-fw pi-lock'
  image?: string; // image src
  color?: 'primary' | 'warning';
  dark?: boolean;
  buttonLabel?: string;
  buttonTo?: string;
  buttonSeverity?: string;
}>();
</script>

<template>
  <div
    class="info-card"
    :class="[`info-card--${color || 'primary'}`, { 'info-card--dark': dark }]"
  >
    <div class="info-card__inner">
      <div class="info-card__content">
        <div v-if="icon" class="info-card__icon-container">
          <i :class="['info-card__icon', icon]"></i>
        </div>
        <span v-if="preTitle" class="info-card__pre-title">{{ preTitle }}</span>
        <h1 class="info-card__title">{{ title }}</h1>
        <span v-if="subtitle" class="info-card__subtitle">{{ subtitle }}</span>
        <img v-if="image" :src="image" class="info-card__image" />
        <slot></slot>
        <Button
          v-if="buttonLabel && buttonTo"
          as="router-link"
          :label="buttonLabel"
          :to="buttonTo"
          :severity="buttonSeverity || undefined"
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

  &--warning {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--warning-color-muted), transparent 60%) 10%,
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
  &--warning &__icon-container {
    border-color: rgb(249 115 22);
  }

  &__icon {
    color: var(--p-primary-color);
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }
  &--warning &__icon {
    color: rgb(249 115 22);
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
  &__image {
    margin-bottom: 2rem;
    width: 80%;
  }
  &__button {
    text-align: center;
    margin-top: 2rem;
  }
}
</style> 