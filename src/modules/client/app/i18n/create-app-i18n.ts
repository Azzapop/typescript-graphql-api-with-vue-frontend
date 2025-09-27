import { createI18n } from 'vue-i18n';
import enAU from './locales/en-AU.json';
import { type PreLoadedLocale } from './preloaded-locales';

type MessageSchema = typeof enAU;
// Use constants to enforce type safety so we enforce the locale is one of the preloaded locales
const DEFAULT_LOCALE: PreLoadedLocale = 'en-AU';
const FALLBACK_LOCALE: PreLoadedLocale = 'en-AU';

export const createAppI18n = () => {
  const i18n = createI18n<[MessageSchema], PreLoadedLocale>({
    legacy: false, // Enables the composition API
    locale: DEFAULT_LOCALE,
    fallbackLocale: FALLBACK_LOCALE,
    messages: {
      'en-AU': enAU,
    },
    globalInjection: true,
  });

  return i18n;
};
