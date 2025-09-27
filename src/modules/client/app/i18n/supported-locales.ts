export const SUPPORTED_LOCALES = ['en-AU', 'es', 'fr', 'de'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
