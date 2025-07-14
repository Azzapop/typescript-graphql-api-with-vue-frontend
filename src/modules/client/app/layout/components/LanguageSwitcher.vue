<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useNamespacedI18n } from '@app/i18n/use-namespaced-i18n';
import Listbox from 'primevue/listbox';
import type { Locale } from '@app/i18n/messages';
import { loadLocaleMessages } from '@app/i18n/change-locale';

const { locale: currentLocale, setLocaleMessage } = useI18n({ useScope: 'global' });
const { t } = useNamespacedI18n('language-switcher');

const supportedLocales: { value: Locale; label: string; flag: string }[] = [
  { value: 'en-AU', label: 'English (Australia)', flag: '🇦🇺' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const changeLocale = async (event: { value: Locale }) => {
  const newLocale = event.value;
  if (currentLocale.value === newLocale) return
  console.log('changing locale', newLocale)

  await loadLocaleMessages(newLocale, setLocaleMessage)
  currentLocale.value = newLocale
}
</script>

<template>
  <div class="language-switcher">
    <div class="language-switcher__settings">
      <div class="language-switcher__selector">
        <span class="language-switcher__label">{{ t('language') }}</span>
        <Listbox
          v-model="currentLocale"
          @change="changeLocale"
          :options="supportedLocales"
          :allowEmpty="false"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Language"
          class="language-switcher__listbox"
        >
          <template #option="{ option }">
            <div class="language-switcher__option">
              <span class="language-switcher__flag">{{ option.flag }}</span>
              <span class="language-switcher__label-text">{{ option.label }}</span>
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
    color: var(--p-text-muted-color);
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

  &__selected {
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