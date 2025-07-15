import type { SupportedLocale } from './supported-locales';
import { preloadedLocales } from './preloaded-locales';
import type { Composer } from 'vue-i18n';

const loadedLanguages = new Set<SupportedLocale>(preloadedLocales);

export const loadLocaleMessages = async (
  locale: SupportedLocale, 
  setLocaleMessage: Composer['setLocaleMessage']
): Promise<void> => {
  if (loadedLanguages.has(locale)) return;

  const messages = await import(
    /* @vite-ignore */ `./locales/${locale}.json`
  ).then(m => m.default);

  setLocaleMessage(locale, messages);
  loadedLanguages.add(locale);
};