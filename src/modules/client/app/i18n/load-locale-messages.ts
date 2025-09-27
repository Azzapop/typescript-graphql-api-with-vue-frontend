import type { Composer } from 'vue-i18n';
import { PRELOADED_LOCALES } from './preloaded-locales';
import type { SupportedLocale } from './supported-locales';

const LOADED_LANGUAGES = new Set<SupportedLocale>(PRELOADED_LOCALES);

export const loadLocaleMessages = async (
  locale: SupportedLocale,
  setLocaleMessage: Composer['setLocaleMessage']
): Promise<void> => {
  if (LOADED_LANGUAGES.has(locale)) return;

  const messages = await import(
    /* @vite-ignore */ `./locales/${locale}.json`
  ).then((m) => m.default);

  setLocaleMessage(locale, messages);
  LOADED_LANGUAGES.add(locale);
};
