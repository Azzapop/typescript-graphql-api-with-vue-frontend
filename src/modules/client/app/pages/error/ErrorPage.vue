<script setup lang="ts">
import InfoCard from '@app/components/InfoCard.vue';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import { useGlobalErrorStore } from '@app/stores/global-error-store';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import ErrorImage from './ErrorImage.vue';

const { t } = useNamespacedI18n('error-page');
const errorStore = useGlobalErrorStore();
const { traceToken } = storeToRefs(errorStore);
const router = useRouter();

const handleGoHome = () => {
  errorStore.clearGlobalError();
  router.push({ name: 'home' });
};
</script>

<template>
  <FloatingMenuCardLayout>
    <InfoCard
      icon="pi pi-exclamation-circle"
      :title="t('title')"
      :subtitle="t('subtitle')"
      severity="danger"
    >
      <ErrorImage />
      <div v-if="traceToken" class="error-page__trace-token">
        <span class="error-page__trace-label">{{
          t('trace-token-label')
        }}</span>
        <code class="error-page__trace-value">{{ traceToken }}</code>
      </div>
      <Button
        :label="t('button-label')"
        severity="danger"
        class="error-page__button"
        @click="handleGoHome"
      />
    </InfoCard>
  </FloatingMenuCardLayout>
</template>

<style lang="scss">
.error-page {
  &__trace-token {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.5rem;
  }

  &__trace-label {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
  }

  &__trace-value {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    user-select: all;
  }

  &__button {
    text-align: center;
    margin-top: 2rem;
  }
}
</style>
