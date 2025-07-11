import { i18n } from './i18n';
import type { Locale } from './messages';

const loadedLanguages = new Set<Locale>(['en']);

const loadLocaleMessages = async (locale: Locale) => {
  if (loadedLanguages.has(locale)) return {};

  const messages = await import(
    /* @vite-ignore */ `./locales/${locale}.json`
  ).then(m => m.default);

  i18n.global.setLocaleMessage(locale, messages);
  loadedLanguages.add(locale);
};

export const changeLocale = async (newLocale: Locale) => {
  if (i18n.global.locale === newLocale) return;

  await loadLocaleMessages(newLocale);
  i18n.global.locale = newLocale;
};