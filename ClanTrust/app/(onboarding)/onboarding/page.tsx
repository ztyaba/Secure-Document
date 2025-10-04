'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { clans } from '@/lib/constants';
import { useI18n } from '@/components/i18n-provider';
import { ConsentCapture } from '@/components/consent-capture';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';

const onboardingSchema = z.object({
  language: z.string(),
  name: z.string().min(2),
  phone: z.string().min(9),
  clan: z.string(),
  consent: z.boolean(),
  plainLanguage: z.boolean().default(false)
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const steps = ['language', 'info', 'clan', 'consent'] as const;

type Step = (typeof steps)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const { setLocale, t } = useI18n();
  const [stepIndex, setStepIndex] = useState(0);
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      language: 'en',
      name: '',
      phone: '',
      clan: clans[0].value,
      consent: false,
      plainLanguage: false
    }
  });

  const step = steps[stepIndex];

  const next = async () => {
    if (step === 'consent') {
      const values = form.getValues();
      if (!values.consent) return;
      router.push('/documents');
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const back = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const onSelectLanguage = (value: string) => {
    form.setValue('language', value);
    setLocale(value);
  };

  const stepContent: Record<Step, React.ReactNode> = {
    language: (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Choose your language</h2>
        <p className="text-sm text-slate-600">
          Select the language you are most comfortable with.
        </p>
        <Select value={form.watch('language')} onValueChange={onSelectLanguage}>
          <option value="en">English</option>
          <option value="lg">Luganda</option>
          <option value="sw">Swahili</option>
        </Select>
        <Toggle
          pressed={form.watch('plainLanguage')}
          onPressedChange={(value) => form.setValue('plainLanguage', value)}
        >
          {t('simple_language', 'Simple language')}
        </Toggle>
      </div>
    ),
    info: (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Personal information</h2>
        <Input placeholder="Full name" {...form.register('name')} />
        <Input placeholder="Phone number" {...form.register('phone')} />
      </div>
    ),
    clan: (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">{t('choose_clan', 'Choose your clan')}</h2>
        <Select value={form.watch('clan')} onValueChange={(value) => form.setValue('clan', value)}>
          {clans.map((clan) => (
            <option key={clan.value} value={clan.value}>
              {clan.label}
            </option>
          ))}
        </Select>
      </div>
    ),
    consent: (
      <ConsentCapture
        value={form.watch('consent')}
        onChange={(value) => form.setValue('consent', value)}
        plainLanguage={form.watch('plainLanguage')}
      />
    )
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Onboarding</h1>
        <p className="text-sm text-slate-600">
          Step {stepIndex + 1} of {steps.length}
        </p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg bg-white p-6 shadow"
        >
          {stepContent[step]}
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={stepIndex === 0}>
          Back
        </Button>
        <Button onClick={next}>{step === 'consent' ? 'Finish' : 'Continue'}</Button>
      </div>
    </main>
  );
}
