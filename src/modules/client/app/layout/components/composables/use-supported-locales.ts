import { type ExhaustiveTuple, type Mutable } from '~libs/helper-types';
import type {
  SupportedLocale,
  SUPPORTED_LOCALES,
} from '~modules/client/app/i18n/supported-locales';

type SupportedLocaleOption<L extends SupportedLocale> = {
  value: L;
  label: string;
  flag: string;
};
type SupportedLocaleOptions = ExhaustiveTuple<
  typeof SUPPORTED_LOCALES,
  SupportedLocaleOption<SupportedLocale>
>;

const READONLY_SUPPORTED_LOCALE_OPTIONS: SupportedLocaleOptions = [
  { value: 'en-AU', label: 'English (Australia)', flag: '🇦🇺' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
] as const;

// Use typecast here. We know that the array provided is mutable, but the type system doesn't.
const SUPPORTED_LOCALE_OPTIONS: Mutable<SupportedLocaleOptions> = [
  ...READONLY_SUPPORTED_LOCALE_OPTIONS,
];

export const useSupportedLocaleOptions =
  (): Mutable<SupportedLocaleOptions> => {
    return SUPPORTED_LOCALE_OPTIONS;
  };
