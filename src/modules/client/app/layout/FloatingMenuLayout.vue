<script setup lang="ts">
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { useTemplateRef } from 'vue';
import { assert } from '~libs/client-utils';
import AppConfigurator from './components/AppConfigurator.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import { useLayout } from './composables/layout';

const { toggleDarkMode, isDarkTheme } = useLayout();

const floatingAppConfiguratorPopover = useTemplateRef<
  InstanceType<typeof Popover>
>('floating-app-configurator-popover');
const toggleAppConfigurator = (e: Event) => {
  assert(floatingAppConfiguratorPopover.value);
  floatingAppConfiguratorPopover.value.toggle(e);
};

const floatingLanguageSwitcherPopover = useTemplateRef<
  InstanceType<typeof Popover>
>('floating-language-switcher-popover');
const toggleLanguageSwitcher = (e: Event) => {
  assert(floatingLanguageSwitcherPopover.value);
  floatingLanguageSwitcherPopover.value.toggle(e);
};
</script>

<template>
  <div class="floating-menu-layout">
    <Button
      type="button"
      @click="toggleDarkMode"
      rounded
      :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'"
      severity="secondary"
    />
    <div class="floating-menu-layout__app-configurator">
      <Button
        @click="toggleAppConfigurator"
        type="button"
        rounded
        icon="pi pi-palette"
      />
      <Popover ref="floating-app-configurator-popover">
        <AppConfigurator />
      </Popover>
    </div>
    <div class="floating-menu-layout__language-switcher">
      <Button
        @click="toggleLanguageSwitcher"
        type="button"
        rounded
        icon="pi pi-language"
      />
      <Popover ref="floating-language-switcher-popover">
        <LanguageSwitcher />
      </Popover>
    </div>
  </div>
  <slot></slot>
</template>

<style lang="scss">
.floating-menu-layout {
  gap: 1rem;
  display: flex;
  top: 2rem;
  right: 2rem;
  position: fixed;

  &__app-configurator {
    position: relative;
  }

  &__language-switcher {
    position: relative;
  }
}
</style>
