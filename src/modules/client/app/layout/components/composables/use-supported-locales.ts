import type { SupportedLocale } from '~modules/client/app/i18n/supported-locales';
import { supportedLocales } from '~modules/client/app/i18n/supported-locales';
import { type ExhaustiveTuple } from '~libs/helper-types';

type SupportedLocaleOption<L extends SupportedLocale> = { value: L; label: string; flag: string };
type SupportedLocales = ExhaustiveTuple<typeof supportedLocales, SupportedLocaleOption<SupportedLocale>>;

const readonlySupportedLocaleOptions: SupportedLocales = [
  { value: 'en-AU', label: 'English (Australia)', flag: '🇦🇺' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const supportedLocaleOptions = Array.from(readonlySupportedLocaleOptions);

export function useSupportedLocaleOptions() {
  return supportedLocaleOptions;
} 