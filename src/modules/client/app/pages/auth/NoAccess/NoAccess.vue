<script setup lang="ts">
import FloatingMenuLayout from '@app/layout/FloatingMenuLayout/FloatingMenuLayout.vue';
import { useLayout } from '@app/layout/composables/layout';
import InfoCard from '@app/components/InfoCard.vue';

// Import the image so Vite/Webpack resolves it as a module
import noAccessImg from '../../../assets/images/no-access.svg';

const { isDarkTheme } = useLayout();
</script>

<template>
  <FloatingMenuLayout>
    <div class="no-access__wrapper">
      <div class="no-access__inner">
        <InfoCard
          title="Access Denied"
          subtitle="You do not have the necessary permisions. Please contact admins."
          icon="pi pi-fw pi-lock"
          :image="noAccessImg"
          color="warning"
          :dark="isDarkTheme"
        >
          <div class="no-access__button-container">
            <Button
              as="router-link"
              label="Go to Dashboard"
              to="/"
              severity="warn"
            />
          </div>
        </InfoCard>
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

  &__button-container {
    text-align: center;
    margin-top: 2rem;
  }
}
</style>
