<script setup lang="ts">
import InfoCard from '@app/components/InfoCard.vue';
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import ErrorImage from './ErrorImage.vue';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';

const { t } = useNamespacedI18n('error-page')
</script>

<template>
  <FloatingMenuCardLayout>
    <InfoCard
      icon="pi pi-exclamation-circle"
      :title="t('title')"
      :subtitle="t('subtitle')"
      :button-label="t('button-label')"
      buttonTo="/"
      severity="danger"
    >
      <ErrorImage />
    </InfoCard>
  </FloatingMenuCardLayout>
</template>
