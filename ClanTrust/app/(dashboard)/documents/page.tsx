import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DocumentList } from '@/components/document-list';
import { RoleGate } from '@/components/role-gate';
import { getTranslations, toLocaleKey } from '@/lib/i18n';

export const runtime = 'nodejs';

export default async function DocumentsPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: { user: true }
  });

  const documents = await prisma.document.findMany({
    where: {
      ownerUserId: user.id
    },
    orderBy: { createdAt: 'desc' }
  });

  const locale = toLocaleKey(profile?.language);
  const t = await getTranslations(locale);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('welcome', 'Welcome to the secure ClanTrust portal')}</h1>
        <p className="text-slate-600">
          Track document status, initiate Dropbox Sign workflows, and manage your Google Drive vault.
        </p>
      </header>
      <RoleGate roles={['admin', 'paralegal', 'notary']}>
        <div className="rounded-md border border-dashed border-brand/30 p-4 text-sm text-slate-600">
          Staff view: manage all client folders and generate audit reports.
        </div>
      </RoleGate>
      <DocumentList documents={documents} userId={user.id} />
    </main>
  );
}
