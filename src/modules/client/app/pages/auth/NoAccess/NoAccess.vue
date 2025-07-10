<script setup lang="ts">
import FloatingMenuLayout from '@app/layout/FloatingMenuLayout/FloatingMenuLayout.vue';
import InfoCard from '@app/components/InfoCard.vue';
import NoAccessImage from './NoAccessImage.vue';
</script>

<template>
  <FloatingMenuLayout>
    <div class="no-access__wrapper">
      <div class="no-access__inner">
        <InfoCard
          title="Access Denied"
          subtitle="You do not have the necessary permisions. Please contact admins."
          icon="pi pi-fw pi-lock"
          severity="warn"
          buttonLabel="Go to Dashboard"
          buttonTo="/"
        >
          <NoAccessImage />
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
