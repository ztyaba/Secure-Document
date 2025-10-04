'use client';

import { useI18n } from './i18n-provider';
import { Select } from '@/components/ui/select';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as any)} className="w-32 text-sm">
      <option value="en">English</option>
      <option value="lg">Luganda</option>
      <option value="sw">Swahili</option>
    </Select>
  );
}
