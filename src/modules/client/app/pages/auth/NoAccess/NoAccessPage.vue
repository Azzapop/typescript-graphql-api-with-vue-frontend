<script setup lang="ts">
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import InfoCard from '@app/components/InfoCard.vue';
import NoAccessImage from './NoAccessImage.vue';
</script>

<template>
  <FloatingMenuCardLayout>
        <InfoCard
          title="Access Denied"
          subtitle="You do not have the necessary permisions. Please contact admins."
          icon="pi pi-lock"
          severity="warn"
          buttonLabel="Go to Dashboard"
          buttonTo="/"
        >
          <NoAccessImage />
        </InfoCard>
  </FloatingMenuCardLayout>
</template>

<style lang="scss">
.no-access {
  &__button-container {
    text-align: center;
    margin-top: 2rem;
  }
}
</style>
