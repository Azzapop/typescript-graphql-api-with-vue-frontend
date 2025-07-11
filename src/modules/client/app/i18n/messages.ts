import en from './locales/en.json'

export const messages = {
  en
}

export type MessageSchema = typeof en

// Maintain this independent of the messages object as the two are not related
export type Locale = 'en'