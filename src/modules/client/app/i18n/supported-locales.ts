export const supportedLocales = ['en-AU', 'es', 'fr', 'de'] as const;
export type SupportedLocale = (typeof supportedLocales)[number]