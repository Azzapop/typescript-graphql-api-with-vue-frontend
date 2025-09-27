<script setup lang="ts">
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import AppLayout from '@app/layout/App/AppLayout.vue';
import Button from 'primevue/button';

const { t } = useNamespacedI18n('home-page');
</script>
<template>
  <AppLayout>
    <p>{{ t('home') }}</p>
    <Button :label="t('submit')" />
  </AppLayout>
</template>
