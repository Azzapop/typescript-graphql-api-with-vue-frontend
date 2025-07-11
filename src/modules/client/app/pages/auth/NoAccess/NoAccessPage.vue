<script setup lang="ts">
import InfoCard from '@app/components/InfoCard.vue';
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import NoAccessImage from './NoAccessImage.vue';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';

const { t } = useNamespacedI18n('no-access-page');
</script>

<template>
  <FloatingMenuCardLayout>
    <InfoCard
      :title="t('title')"
      :subtitle="t('subtitle')"
      icon="pi pi-lock"
      severity="warn"
      :buttonLabel="t('button-label')"
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
