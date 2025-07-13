import { createI18n } from 'vue-i18n';
import { messages, type MessageSchema, type Locale } from './messages';

export const createAppI18n = () => {
  const i18n = createI18n<[MessageSchema], Locale>(({
    legacy: false,
    locale: 'en-AU',
    fallbackLocale: 'en-AU',
    messages,
    globalInjection: true,
  }))

  return i18n
}