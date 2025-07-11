import { i18n } from './create-i18n';

const loadLocaleMessages: (locale: string) => Promise<object> = (locale) => {
  return import(`./locales/${locale}.json`).then(m => m.default);
};

export const setLocale: (locale: string) => Promise<void> = async (locale) => {
  if ((i18n.global.availableLocales as any).includes(locale)) {
    (i18n.global.locale as any).value = locale;
    return;
  }
  const loaded = await loadLocaleMessages(locale);
  (i18n.global.setLocaleMessage as any)(locale, loaded);
  (i18n.global.locale as any).value = locale;
}; 