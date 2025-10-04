import en from '@/locales/en/common.json';
import lg from '@/locales/lg/common.json';
import sw from '@/locales/sw/common.json';

const dictionaries = {
  en,
  lg,
  sw
};

export type LocaleKey = keyof typeof dictionaries;

type Dictionary = typeof en;

export async function getTranslations(locale: LocaleKey): Promise<(key: keyof Dictionary, fallback?: string) => string> {
  const dict = dictionaries[locale] ?? dictionaries.en;
  return (key: keyof Dictionary, fallback?: string) => dict[key] ?? fallback ?? key;
}

export function getDictionary(locale: LocaleKey): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
