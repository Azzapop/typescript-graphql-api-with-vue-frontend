<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useLayout } from '../composables/layout';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

const { layoutConfig, layoutState, isSidebarActive, resetMenu } = useLayout();

const outsideClickListenerFunc = (event: MouseEvent) => {
  if (isOutsideClicked(event)) {
    resetMenu();
  }
};

const outsideClickListener = ref<typeof outsideClickListenerFunc | null>(null);

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});

const classes = (baseClassName: string) => {
  return {
    [`${baseClassName}--overlay`]: layoutConfig.menuMode === 'overlay',
    [`${baseClassName}--overlay-active`]: layoutState.overlayMenuActive,
    [`${baseClassName}--static`]: layoutConfig.menuMode === 'static',
    [`${baseClassName}--static-inactive`]:
      layoutState.staticMenuDesktopInactive &&
      layoutConfig.menuMode === 'static',
    [`${baseClassName}--mobile-active`]: layoutState.staticMenuMobileActive,
  };
};

const sidebarClass = computed(() => {
  return classes('layout-wrapper__sidebar');
});

const mainContainerClass = computed(() => {
  return classes('layout-wrapper__main-container');
});

const maskClass = computed(() => {
  return classes('layout-wrapper__mask');
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = outsideClickListenerFunc;
    document.addEventListener('click', outsideClickListener.value);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener.value);
    outsideClickListener.value = null;
  }
};

const isNode = (e: EventTarget | null): e is Node => {
  return !(!e || !('nodeType' in e));
};

const isOutsideClicked = (event: MouseEvent) => {
  // TODO these depend on classes from inside the sidebar, come up with a way to not need to
  // know this knowledge
  const sidebarEl = document.querySelector('.layout-sidebar');
  const topbarEl = document.querySelector('.layout-topbar__sidebar-button');

  if (!isNode(event.target)) return false;

  return !(
    sidebarEl?.isSameNode(event.target) ||
    sidebarEl?.contains(event.target) ||
    topbarEl?.isSameNode(event.target) ||
    topbarEl?.contains(event.target)
  );
};
</script>

<template>
  <div class="layout-wrapper">
    <app-topbar></app-topbar>
    <app-sidebar
      class="layout-wrapper__sidebar"
      :class="sidebarClass"
    ></app-sidebar>
    <div class="layout-wrapper__main-container" :class="mainContainerClass">
      <div class="layout-wrapper__main">
        <slot></slot>
      </div>
      <app-footer></app-footer>
    </div>
    <div class="layout-wrapper__mask animate-fadein" :class="maskClass"></div>
  </div>
  <Toast />
</template>

<style lang="scss">
.layout-wrapper {
  min-height: 100vh;

  &__main-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: space-between;
    padding: 6rem 2rem 0 2rem;
    transition: margin-left var(--layout-section-transition-duration);
  }

  &__main {
    flex: 1 1 auto;
    padding-bottom: 2rem;
  }
}

@media screen and (min-width: 1960px) {
  .layout-wrpper {
    &__main {
      width: 1504px;
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }
}

@media (min-width: 992px) {
  .layout-wrapper {
    &__sidebar {
      &--overlay {
        transform: translateX(-100%);
        left: 0;
        top: 0;
        height: 100vh;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-right: 1px solid var(--surface-border);
        transition:
          transform 0.4s cubic-bezier(0.05, 0.74, 0.2, 0.99),
          left 0.4s cubic-bezier(0.05, 0.74, 0.2, 0.99);
        box-shadow:
          0px 3px 5px rgba(0, 0, 0, 0.02),
          0px 0px 2px rgba(0, 0, 0, 0.05),
          0px 1px 4px rgba(0, 0, 0, 0.08);
      }

      &--overlay-active {
        transform: translateX(0);
      }

      &--static-inactive {
        transform: translateX(-100%);
        left: 0;
      }
    }

    &__main-container {
      &--overlay {
        margin-left: 0;
        padding-left: 2rem;
      }

      &--static {
        margin-left: 22rem;
      }

      &--static-inactive {
        margin-left: 0;
        padding-left: 2rem;
      }
    }

    &__mask {
      display: none;
    }
  }
}

@media (max-width: 991px) {
  .layout-wrapper {
    &__sidebar {
      transform: translateX(-100%);
      left: 0;
      top: 0;
      height: 100vh;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      transition:
        transform 0.4s cubic-bezier(0.05, 0.74, 0.2, 0.99),
        left 0.4s cubic-bezier(0.05, 0.74, 0.2, 0.99);

      &--mobile-active {
        transform: translateX(0);
      }
    }

    &__main-container {
      margin-left: 0;
      padding-left: 2rem;
    }

    &__mask {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 998;
      width: 100%;
      height: 100%;
      background-color: var(--maskbg);

      &--mobile-active {
        display: block;
      }
    }
  }
}
</style>
