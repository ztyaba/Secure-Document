import Link from 'next/link';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ClanHighlights } from '@/components/clan-highlights';
import { CTAButtons } from '@/components/cta-buttons';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-brand-soft">
      <header className="flex flex-col gap-4 bg-white/80 px-6 py-8 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-brand">
            ClanTrust
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">Secure wills & trusts for Ugandan clans</h1>
          <p className="text-base text-slate-600">
            Upload, review, and sign documents with Dropbox Sign, all safely stored in Google Drive with compliance
            workflows.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand text-brand-soft px-4 py-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Bank-grade encryption
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand text-brand-soft px-4 py-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Dropbox Sign + Google Drive
            </span>
          </div>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12">
        <ClanHighlights />
        <CTAButtons />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">Get started</h2>
            <p className="text-slate-600">Sign in with email or phone OTP via Clerk.</p>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-white hover:bg-slate-800"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">Continue to your workspace</h2>
            <Link
              href="/documents"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-white hover:bg-slate-800"
            >
              Open documents
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
