import { SupportedLocale } from "./supported-locales"

type SupportedLocaleSubset<T extends SupportedLocale> = T
export type PreLoadedLocale = SupportedLocaleSubset<'en-AU'>

export const preloadedLocales: PreLoadedLocale[] = ['en-AU']