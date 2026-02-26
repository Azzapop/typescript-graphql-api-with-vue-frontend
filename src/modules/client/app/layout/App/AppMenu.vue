<script setup lang="ts">
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import type { MenuItem } from 'primevue/menuitem';
import { computed } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const { t } = useNamespacedI18n('app-menu');

// First level: label
// Second level: items
// Third level: recursive items etc
// Make the model reactive to locale changes using computed
const model = computed<MenuItem[]>(() => [
  {
    label: t('home'),
    items: [{ label: t('dashboard'), icon: 'pi pi-fw pi-home', to: '/' }],
  },
  {
    label: t('error-testing'),
    items: [
      {
        label: t('network-error'),
        icon: 'pi pi-fw pi-wifi',
        to: '/error-testing/network',
      },
      {
        label: t('graphql-error'),
        icon: 'pi pi-fw pi-database',
        to: '/error-testing/graphql',
      },
      {
        label: t('graphql-ssr-error'),
        icon: 'pi pi-fw pi-server',
        to: '/error-testing/graphql-ssr',
      },
    ],
  },
  {
    label: t('error-pages'),
    items: [
      {
        label: t('error'),
        icon: 'pi pi-fw pi-times-circle',
        to: '/error',
      },
      {
        label: t('access-denied'),
        icon: 'pi pi-fw pi-lock',
        to: '/no-access',
      },
      {
        label: t('not-found'),
        icon: 'pi pi-fw pi-question',
        to: '/not-found',
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="layout-menu__separator"></li>
    </template>
  </ul>
</template>

<style lang="scss">
.layout-menu {
  margin: 0;
  padding: 0;
  list-style-type: none;

  &__seperate {
    // TODO
  }
}
</style>
