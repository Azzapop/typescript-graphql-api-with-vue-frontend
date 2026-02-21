// NOTE: There is a known issue with PrimeVue's Listbox hover state where the
hover style can remain stuck on an option after selecting a locale and then
hovering another option. // This occurs even when using the default template,
and is likely a bug or limitation in the current PrimeVue version. // If
PrimeVue updates or a workaround is found, this should be revisited.

<script setup lang="ts">
import { loadLocaleMessages } from '@app/i18n/load-locale-messages';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import Listbox from 'primevue/listbox';
import { useI18n } from 'vue-i18n';
import type { SupportedLocale } from '~modules/client/app/i18n/supported-locales';
import { useSupportedLocaleOptions } from './composables/use-supported-locales';

const { locale: currentLocale, setLocaleMessage } = useI18n({
  useScope: 'global',
});
const { t } = useNamespacedI18n('language-switcher');

const supportedLocalesOptions = useSupportedLocaleOptions();

const changeLocale = async (event: { value: SupportedLocale }) => {
  const { value: newLocale } = event;

  if (!newLocale) return;
  if (currentLocale.value === newLocale) return;

  await loadLocaleMessages(newLocale, setLocaleMessage);
  currentLocale.value = newLocale;
};
</script>

<template>
  <div class="language-switcher">
    <div class="language-switcher__settings">
      <div class="language-switcher__selector">
        <span class="language-switcher__label">{{ t('language') }}</span>
        <Listbox
          :modelValue="currentLocale"
          @change="changeLocale"
          :options="Array.from(supportedLocalesOptions)"
          :allowEmpty="false"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Language"
          class="language-switcher__listbox"
        >
          <template #option="{ option }">
            <div class="language-switcher__option">
              <span class="language-switcher__flag">{{ option.flag }}</span>
              <span class="language-switcher__label-text">{{
                option.label
              }}</span>
            </div>
          </template>
        </Listbox>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.language-switcher {
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

  &__selector {
    gap: 0.5rem;
    flex-direction: column;
    display: flex;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__flag {
    font-size: 1.25rem;
  }

  &__label-text {
    font-size: 0.875rem;
  }
}

// We need a more specific selector to override the default styles of the Listbox component
.language-switcher .language-switcher__listbox {
  border: none;
  box-shadow: none;
}
</style>
