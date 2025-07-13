import type { Locale } from './messages';
import { useI18n, type VueI18n } from 'vue-i18n';

const loadedLanguages = new Set<Locale>(['en-AU']);

export const loadLocaleMessages = async (locale: Locale, setLocaleMessage: any): Promise<void> => {
  if (loadedLanguages.has(locale)) return;

  const messages = await import(
    /* @vite-ignore */ `./locales/${locale}.json`
    // TODO actually correct m.default
  ).then(m => m.default);

  setLocaleMessage(locale, messages);
  loadedLanguages.add(locale);
};