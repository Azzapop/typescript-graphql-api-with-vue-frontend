import { createI18n } from 'vue-i18n';
import { type PreLoadedLocale } from './preloaded-locales';
import en from './locales/en.json'

type MessageSchema = typeof en

// Use constants to enforce type safety so we enforce the locale is one of the preloaded locales
const defaultLocale: PreLoadedLocale = 'en-AU' as const;
const fallbackLocale: PreLoadedLocale = 'en-AU';

export const createAppI18n = () => {
  const i18n = createI18n<[MessageSchema], PreLoadedLocale>(({
    legacy: false, // Enables the composition API
    locale: defaultLocale,
    fallbackLocale,
    messages: {
      'en-AU': en,
    },
    globalInjection: true,
  }))

  return i18n
}