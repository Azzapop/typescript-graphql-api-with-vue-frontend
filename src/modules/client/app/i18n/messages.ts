import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'

export const messages = {
  'en-AU': en,
  'es': es,
  'fr': fr,
  'de': de,
}

export type MessageSchema = typeof en

// Maintain this independent of the messages object as the two are not related
export type Locale = 'en-AU' | 'es' | 'fr' | 'de'