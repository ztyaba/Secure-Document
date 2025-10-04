'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { getDictionary, LocaleKey } from '@/lib/i18n';

type I18nContextValue = {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => void;
  t: (key: keyof ReturnType<typeof getDictionary>, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<LocaleKey>('en');

  const value = useMemo<I18nContextValue>(() => {
    const dict = getDictionary(locale);
    return {
      locale,
      setLocale,
      t: (key, fallback) => (dict as any)[key] ?? fallback ?? String(key)
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
