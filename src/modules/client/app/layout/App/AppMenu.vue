<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';
import { computed } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';

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
    label: t('ui-components'),
    items: [
      {
        label: t('form-layout'),
        icon: 'pi pi-fw pi-id-card',
        to: '/uikit/formlayout',
      },
      { label: t('input'), icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
      {
        label: t('button'),
        icon: 'pi pi-fw pi-mobile',
        to: '/uikit/button',
        class: 'rotated-icon',
      },
      { label: t('table'), icon: 'pi pi-fw pi-table', to: '/uikit/table' },
      { label: t('list'), icon: 'pi pi-fw pi-list', to: '/uikit/list' },
      { label: t('tree'), icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
      { label: t('panel'), icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
      { label: t('overlay'), icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
      { label: t('media'), icon: 'pi pi-fw pi-image', to: '/uikit/media' },
      { label: t('menu'), icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
      { label: t('message'), icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
      { label: t('file'), icon: 'pi pi-fw pi-file', to: '/uikit/file' },
      { label: t('chart'), icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
      {
        label: t('timeline'),
        icon: 'pi pi-fw pi-calendar',
        to: '/uikit/timeline',
      },
      { label: t('misc'), icon: 'pi pi-fw pi-circle', to: '/uikit/misc' },
    ],
  },
  {
    label: t('pages'),
    icon: 'pi pi-fw pi-briefcase',
    to: '/pages',
    items: [
      {
        label: t('landing'),
        icon: 'pi pi-fw pi-globe',
        to: '/landing',
      },
      {
        label: t('auth'),
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: t('login'),
            icon: 'pi pi-fw pi-sign-in',
            to: '/auth/login',
          },
          {
            label: t('error'),
            icon: 'pi pi-fw pi-times-circle',
            to: '/auth/error',
          },
          {
            label: t('access-denied'),
            icon: 'pi pi-fw pi-lock',
            to: '/auth/access',
          },
        ],
      },
      {
        label: t('crud'),
        icon: 'pi pi-fw pi-pencil',
        to: '/pages/crud',
      },
      {
        label: t('not-found'),
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/pages/notfound',
      },
      {
        label: t('empty'),
        icon: 'pi pi-fw pi-circle-off',
        to: '/pages/empty',
      },
    ],
  },
  {
    label: t('hierarchy'),
    items: [
      {
        label: t('submenu-1'),
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: t('submenu-1-1'),
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: t('submenu-1-1-1'), icon: 'pi pi-fw pi-bookmark' },
              { label: t('submenu-1-1-2'), icon: 'pi pi-fw pi-bookmark' },
              { label: t('submenu-1-1-3'), icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: t('submenu-1-2'),
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: t('submenu-1-2-1'), icon: 'pi pi-fw pi-bookmark' }],
          },
        ],
      },
      {
        label: t('submenu-2'),
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: t('submenu-2-1'),
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: t('submenu-2-1-1'), icon: 'pi pi-fw pi-bookmark' },
              { label: t('submenu-2-1-2'), icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: t('submenu-2-2'),
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: t('submenu-2-2-1'), icon: 'pi pi-fw pi-bookmark' }],
          },
        ],
      },
    ],
  },
  {
    label: t('get-started'),
    items: [
      {
        label: t('documentation'),
        icon: 'pi pi-fw pi-book',
        to: '/documentation',
      },
      {
        label: t('view-source'),
        icon: 'pi pi-fw pi-github',
        url: 'https://github.com/primefaces/sakai-vue',
        target: '_blank',
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
