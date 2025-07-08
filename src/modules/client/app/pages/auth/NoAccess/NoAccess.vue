<script setup lang="ts">
import FloatingMenuLayout from '@app/layout/FloatingMenuLayout/FloatingMenuLayout.vue';
import { useLayout } from '@app/layout/composables/layout';

const { isDarkTheme } = useLayout();
</script>

<template>
  <FloatingMenuLayout>
    <div class="no-access__wrapper">
      <div class="no-access__inner">
        <div class="no-access__card">
          <div
            class="no-access__card-inner"
            :class="{ 'no-access__card-inner--dark': isDarkTheme }"
          >
            <div class="no-access__card-contents">
              <div class="no-access__icon-container">
                <i class="no-access__icon pi pi-fw pi-lock"></i>
              </div>
              <h1 class="no-access__title">Access Denied</h1>
              <span class="no-access__subtext">
                You do not have the necessary permisions. Please contact admins.
              </span>
              <img
                src="../../../assets/images/no-access.svg"
                alt="Access denied"
                class="no-access__image"
              />
              <div class="no-access__button-container">
                <Button
                  as="router-link"
                  label="Go to Dashboard"
                  to="/"
                  severity="warn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FloatingMenuLayout>
</template>

<style lang="scss">
.no-access {
  &__wrapper {
    overflow: hidden;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    display: flex;
  }

  &__inner {
    justify-content: center;
    align-items: center;
    flex-direction: column;
    display: flex;
  }

  &__card {
    border-radius: 56px;
    padding: 0.3rem;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--warning-color-muted), transparent 60%) 10%,
      var(--surface-ground) 30%
    );
  }

  &__card-inner {
    border-radius: 53px; // TODO why not var?
    padding: 5rem;
    background-color: var(--p-surface-0);
    align-items: center;
    flex-direction: column;
    width: 100%;
    display: flex;

    &--dark {
      background-color: var(--p-surface-900); // TODO whyyy
    }
  }

  &__card-contents {
    gap: 1rem;
    align-items: center;
    flex-direction: column;
    display: flex;
  }

  &__icon-container {
    width: 3.2rem;
    height: 3.2rem;
    border-color: rgb(249 115 22);
    border-width: 2px;
    border-radius: 9999px;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  &__icon {
    color: rgb(249 115 22);
    /* Need the importants here to overwrite the icon lib sizes */
    font-size: 1.5rem !important;
    line-height: 2rem !important;
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

  &__subtext {
    color: var(--p-text-muted-color);
    margin-bottom: 2rem;
  }

  &__image {
    margin-bottom: 2rem;
    width: 80%;
  }

  &__button-container {
    text-align: center;
    margin-top: 2rem;
  }
}
</style>
