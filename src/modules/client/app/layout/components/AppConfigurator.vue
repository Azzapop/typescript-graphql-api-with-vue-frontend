<script setup lang="ts">
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import { useAppConfigurator } from '../composables/app-configurator';
import { useLayout } from '../composables/layout';

const { layoutConfig, isDarkTheme } = useLayout();
const { t } = useNamespacedI18n('app-configurator');

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
  <div class="config-panel">
    <div class="config-panel__settings">
      <div>
        <span class="config-panel__label">{{ t('primary') }}</span>
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
        <span class="config-panel__label">{{ t('surface') }}</span>
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
        <span class="config-panel__label">{{ t('presets') }}</span>
        <SelectButton
          v-model="preset"
          @change="onPresetChange"
          :options="presetOptions"
          :allowEmpty="false"
        />
      </div>
      <div class="config-panel__selector">
        <span class="config-panel__label">{{ t('menu-mode') }}</span>
        <SelectButton
          v-model="menuMode"
          @change="onMenuModeChange"
          :options="
            menuModeOptions.map((opt) => ({ ...opt, label: t(opt.value) }))
          "
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
  width: 15rem;

  &__settings {
    gap: 1rem;
    flex-direction: column;
    display: flex;
  }

  &__label {
    color: var(--text-color-secondary);
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
      outline-color: var(--primary-color);
    }
  }

  &__selector {
    gap: 0.5rem;
    flex-direction: column;
    display: flex;
  }
}
</style>
