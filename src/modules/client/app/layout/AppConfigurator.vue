<script setup lang="ts">
import { useAppConfigurator } from './composables/app-configurator';
import { useLayout } from './composables/layout';

const { layoutConfig, isDarkTheme } = useLayout();

const {
  preset,
  presetOptions,
  menuMode,
  menuModeOptions,
  primaryColors,
  surfaces,
  updateColors,
  onPresetChange,
  onMenuModeChange,
} = useAppConfigurator();
</script>

<template>
  <div class="config-panel" :class="{ 'config-panel--dark': isDarkTheme }">
    <div class="config-panel__settings">
      <div>
        <span class="config-panel__label">Primary</span>
        <div class="config-panel__colors">
          <button
            v-for="primaryColor of primaryColors"
            :key="primaryColor.name"
            type="button"
            :title="primaryColor.name"
            @click="updateColors('primary', primaryColor)"
            class="config-panel__color"
            :class="[
              {
                'config-panel__color--outline-primary':
                  layoutConfig.primary === primaryColor.name,
              },
            ]"
            :style="{
              backgroundColor: `${primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500']}`,
            }"
          ></button>
        </div>
      </div>
      <div>
        <span class="config-panel__label">Surface</span>
        <div class="config-panel__colors">
          <button
            v-for="surface of surfaces"
            :key="surface.name"
            type="button"
            :title="surface.name"
            @click="updateColors('surface', surface)"
            class="config-panel__color"
            :class="[
              {
                'config-panel__color--outline-primary': layoutConfig.surface
                  ? layoutConfig.surface === surface.name
                  : isDarkTheme
                    ? surface.name === 'zinc'
                    : surface.name === 'slate',
              },
            ]"
            :style="{ backgroundColor: `${surface.palette['500']}` }"
          ></button>
        </div>
      </div>
      <div class="config-panel__selector">
        <span class="config-panel__label">Presets</span>
        <SelectButton
          v-model="preset"
          @change="onPresetChange"
          :options="presetOptions"
          :allowEmpty="false"
        />
      </div>
      <div class="config-panel__selector">
        <span class="config-panel__label">Menu Mode</span>
        <SelectButton
          v-model="menuMode"
          @change="onMenuModeChange"
          :options="menuModeOptions"
          :allowEmpty="false"
          optionLabel="label"
          optionValue="value"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.config-panel {
  border-radius: var(--p-content-border-radius);
  border-color: var(--p-content-border-color);
  --tw-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05),
    0px 1px 4px rgba(0, 0, 0, 0.08);
  --tw-shadow-colored: 0px 3px 5px var(--tw-shadow-color),
    0px 0px 2px var(--tw-shadow-color), 0px 1px 4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  padding: 1rem;
  --tw-bg-opacity: 1;
  background-color: color-mix(
    in srgb,
    var(--p-surface-0) calc(100% * var(--tw-bg-opacity)),
    transparent
  );
  border-width: 1px;
  transform-origin: top;
  width: 16rem;
  top: 3.25rem;
  right: 0px;
  position: absolute;
  box-sizing: border-box;

  &--dark {
    --tw-bg-opacity: 1;
    background-color: color-mix(
      in srgb,
      var(--p-surface-900) calc(100% * var(--tw-bg-opacity)),
      transparent
    );
  }

  &__settings {
    gap: 1rem;
    flex-direction: column;
    display: flex;
  }

  &__label {
    color: var(--p-text-muted-color);
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  &__colors {
    padding-top: 0.5rem;
    gap: 0.5rem;
    justify-content: space-between;
    flex-wrap: wrap;
    display: flex;
  }

  &__color {
    outline-offset: 1px;
    outline: 2px solid transparent;
    padding: 0;
    border-style: none;
    border-radius: 9999px;
    cursor: pointer;
    width: 1.25rem;
    height: 1.25rem;

    &--outline-primary {
      outline-color: color-mix(
        in srgb,
        var(--p-primary-color) calc(100% * 1),
        transparent
      );
    }
  }

  &__selector {
    gap: 0.5rem;
    flex-direction: column;
    display: flex;
  }
}
</style>
