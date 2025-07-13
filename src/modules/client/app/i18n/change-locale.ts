import type { Locale } from './messages';
import type { I18n } from 'vue-i18n';

const loadedLanguages = new Set<Locale>(['en']);

const loadLocaleMessages = async (i18n: I18n, locale: Locale) => {
  if (loadedLanguages.has(locale)) return {};

  const messages = await import(
    /* @vite-ignore */ `./locales/${locale}.json`
    // TODO actually correct m.default
  ).then(m => m.default);

  i18n.global.setLocaleMessage(locale, messages);
  loadedLanguages.add(locale);
};

export const changeLocale = async (i18n: I18n, newLocale: Locale) => {
  if (i18n.global.locale === newLocale) return;

  await loadLocaleMessages(i18n, newLocale);
  i18n.global.locale = newLocale;
};