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
