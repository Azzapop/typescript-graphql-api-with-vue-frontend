<script setup lang="ts">
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import Divider from 'primevue/divider';
import InfoCard from '@app/components/InfoCard.vue';
import AppLogo from '@app/components/AppLogo.vue';
import NotFoundLink from './NotFoundLink.vue';
</script>

<template>
  <FloatingMenuCardLayout>
    <AppLogo class="not-found__logo" />
    <InfoCard
      :preTitle="'404'"
      title="Not Found"
      subtitle="Requested resource is not available."
      buttonLabel="Go to Dashboard"
      buttonTo="/"
    >
      <div class="not-found__links">
        <NotFoundLink
          to="/"
          icon="pi-table !text-2xl"
          title="Frequently Asked Questions"
          subtext="Ultricies mi quis hendrerit dolor."
        />
        <Divider class="not-found__link-divider" />
        <NotFoundLink
          to="/"
          icon="pi-question-circle"
          title="Solution Center"
          subtext="Phasellus faucibus scelerisque eleifend."
        />
        <Divider class="not-found__link-divider" />
        <NotFoundLink
          to="/"
          icon="pi-unlock"
          title="Permission Manager"
          subtext="Accumsan in nisl nisi scelerisque"
        />
        <Divider class="not-found__link-divider" />
      </div>
    </InfoCard>
  </FloatingMenuCardLayout>
</template>

<style lang="scss">
.not-found {
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

  &__links {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__link-divider {
    margin-top: 2rem !important;
    margin-bottom: 2rem !important;
  }
}
</style>
