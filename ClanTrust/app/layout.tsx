import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/components/i18n-provider';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ClanTrust | Secure Wills & Trusts Portal',
  description: 'Secure wills and trusts portal for Ugandan clans with Dropbox Sign and Google Drive integration.',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/icons/icon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', url: '/icons/icon.svg', type: 'image/svg+xml' }
  ]
};

const enableClerk = process.env.NEXT_PUBLIC_CLERK_MOCK_MODE !== 'true';

const Providers = ({ children }: { children: React.ReactNode }) => {
  if (!enableClerk) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <I18nProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
