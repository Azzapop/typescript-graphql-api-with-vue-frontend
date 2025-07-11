<script setup lang="ts">
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import InfoCard from '@app/components/InfoCard.vue';
import ErrorImage from './ErrorImage.vue';
</script>

<template>
  <FloatingMenuCardLayout>
    <InfoCard
      icon="pi pi-exclamation-circle"
      title="Error Occurred"
      subtitle="Requested resource is not available."
      buttonLabel="Go to Dashboard"
      buttonTo="/"
      severity="danger"
    >
      <ErrorImage />
    </InfoCard>
  </FloatingMenuCardLayout>
</template>

<style lang="scss">
.error-page {
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
}
</style>
