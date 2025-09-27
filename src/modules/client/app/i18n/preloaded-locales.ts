import { type SupportedLocale } from './supported-locales';

type SupportedLocaleSubset<T extends SupportedLocale> = T;
export type PreLoadedLocale = SupportedLocaleSubset<'en-AU'>;

export const PRELOADED_LOCALES: PreLoadedLocale[] = ['en-AU'];
