<script setup lang="ts">
import AppLogo from '@app/components/AppLogo.vue';
import InfoCard from '@app/components/InfoCard.vue';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import FloatingMenuCardLayout from '@app/layout/FloatingMenuCardLayout.vue';
import Divider from 'primevue/divider';
import NotFoundLink from './NotFoundLink.vue';

const { t } = useNamespacedI18n('not-found-page');
const { t: tLink } = useNamespacedI18n('not-found-link');
</script>

<template>
  <FloatingMenuCardLayout>
    <AppLogo class="not-found__logo" />
    <InfoCard
      :preTitle="t('pre-title')"
      :title="t('title')"
      :subtitle="t('subtitle')"
      :buttonLabel="t('button-label')"
      buttonTo="/"
    >
      <div class="not-found__links">
        <NotFoundLink
          to="/"
          icon="pi pi-table"
          :title="tLink('faq-title')"
          :subtext="tLink('faq-subtext')"
        />
        <Divider class="not-found__link-divider" />
        <NotFoundLink
          to="/"
          icon="pi pi-question-circle"
          :title="tLink('solution-title')"
          :subtext="tLink('solution-subtext')"
        />
        <Divider class="not-found__link-divider" />
        <NotFoundLink
          to="/"
          icon="pi pi-unlock"
          :title="tLink('permission-title')"
          :subtext="tLink('permission-subtext')"
        />
        <Divider class="not-found__link-divider" />
      </div>
    </InfoCard>
  </FloatingMenuCardLayout>
</template>

<style lang="scss">
.not-found {
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
