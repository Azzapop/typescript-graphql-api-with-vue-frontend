<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout } from './composables/layout';

const route = useRoute();

const { layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + '-' + props.index
    : String(props.index);

  const activeItem = layoutState.activeMenuItem;

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem
      ? activeItem.startsWith(itemKey.value + '-')
      : false;
});

watch(
  () => layoutState.activeMenuItem,
  (newVal) => {
    isActiveMenu.value =
      newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
  }
);

function itemClick(event, item) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  if (
    (item.to || item.url) &&
    (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)
  ) {
    onMenuToggle();
  }

  if (item.command) {
    item.command({ originalEvent: event, item: item });
  }

  const foundItemKey = item.items
    ? isActiveMenu.value
      ? props.parentItemKey
      : itemKey
    : itemKey.value;

  setActiveMenuItem(foundItemKey);
}

function checkActiveRoute(item) {
  return route.path === item.to;
}
</script>

<template>
  <li>
    <!-- If we're in the root, just show the label as is -->
    <div v-if="root && item.visible !== false" class="layout-menuitem__label">
      {{ item.label }}
    </div>
    <!-- If not in the root, and this has sublevels, render a "button" -->
    <a
      v-if="!root && (!item.to || item.items) && item.visible !== false"
      :href="item.url"
      @click="itemClick($event, item, index)"
      :class="[item.class, 'layout-menuitem__anchor', `layout-menuitem__anchor--depth-${depth}`]"
      :target="item.target"
      tabindex="0"
    >
      <i :class="item.icon" class="layout-menuitem__icon"></i>
      <span>{{ item.label }}</span>
      <i
        class="pi pi-fw pi-angle-down layout-menuitem__submenu-toggler"
        :class="{ 'layout-menuitem__submenu-toggler--active': isActiveMenu }"
        v-if="item.items"
      ></i>
    </a>
    <!-- If no submenu, render a router link directly -->
    <router-link
      v-if="item.to && !item.items && item.visible !== false"
      @click="itemClick($event, item, index)"
      :class="[
        item.class,
        'layout-menuitem__anchor',
        `layout-menuitem__anchor--depth-${depth}`,
        { 'layout-menuitem__anchor--active': checkActiveRoute(item) },
      ]"
      tabindex="0"
      :to="item.to"
    >
      <i :class="item.icon" class="layout-menuitem__icon"></i>
      <span>{{ item.label }}</span>
      <i
        class="pi pi-fw pi-angle-down layout-menuitem__submenu-toggler"
        :class="{ 'layout-menuitem__submenu-toggler--active': isActiveMenu }"
        v-if="item.items"
      ></i>
    </router-link>
    <!-- Recursively render sub menus -->
    <Transition
      v-if="item.items && item.visible !== false"
      name="layout-menuitem__submenu"
    >
    <ul v-show="root ? true : isActiveMenu" :class="['layout-menuitem__submenu', `layout-menuitem__submenu--depth-${depth}`]">
        <app-menu-item
          v-for="(child, i) in item.items"
          :key="child"
          :index="i"
          :item="child"
          :parentItemKey="itemKey"
          :root="false"
          :depth="depth + 1"
        ></app-menu-item>
      </ul>
    </Transition>
  </li>
</template>

<style lang="scss">
@mixin focused-inset() {
  outline-offset: -1px;
  box-shadow: inset var(--focus-ring-shadow);
}

.layout-menuitem {
  &__anchor {
    user-select: none;
    display: flex;
    align-items: center;
    position: relative;
    outline: 0 none;
    color: var(--text-color);
    cursor: pointer;
    padding: 0.75rem 1rem;
    border-radius: var(--content-border-radius);
    transition:
      background-color var(--element-transition-duration),
      box-shadow var(--element-transition-duration);

    &--active {
      font-weight: 700;
      color: var(--primary-color);
    }

    &--depth-2 {
      margin-left: 1rem;
    }

    &--depth-3 {
      margin-left: 2rem;
    }

    &--depth-4 {
      margin-left: 2.5rem;
    }

    &--depth-5 {
      margin-left: 3rem;
    }

    &--depth-6 {
      margin-left: 3.5rem;
    }

    &--depth-7 {
      margin-left: 4rem;
    }

    &:hover {
      background-color: var(--surface-hover);
    }

    &:focus {
      @include focused-inset();
    }
  }

  &__label {
    font-size: 0.857rem;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--text-color);
    margin: 0.75rem 0;
  }

  &__submenu-toggler {
    font-size: 75% !important; // To get around icon library styling
    margin-left: auto;
    transition: transform var(--element-transition-duration);

    &--active {
      transform: rotate(-180deg);
    }
  }

  &__submenu {
    margin: 0;
    padding: 0;
    list-style-type: none;

    &--depth-1 {
      overflow: hidden;
      border-radius: var(--content-border-radius);
    }
  }

  &__icon {
    margin-right: 0.5rem;
  }
}

// The following styles are used for the transition for the submenu
// Because of this, they do not follow BEM principles
.layout-menuitem__submenu-enter-from,
.layout-menuitem__submenu-leave-to {
  max-height: 0;
}

.layout-menuitem__submenu-enter-to,
.layout-menuitem__submenu-leave-from {
  max-height: 1000px;
}

.layout-menuitem__submenu-leave-active {
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}

.layout-menuitem__submenu-enter-active {
  overflow: hidden;
  transition: max-height 1s ease-in-out;
}
</style>
