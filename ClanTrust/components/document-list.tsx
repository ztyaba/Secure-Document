'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { clans } from '@/lib/constants';
import { signDocument } from '@/lib/signature-client';
import { downloadFile } from '@/lib/storage-client';
import { ShieldCheck, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export type DocumentListProps = {
  documents: Array<{
    id: string;
    filename: string;
    signatureStatus: string;
    signatureUrl: string | null;
    ownerUserId: string;
    driveFileId: string;
    checksum: string | null;
    createdAt: Date;
  }>;
  userId: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DocumentList({ documents: initialDocs, userId }: DocumentListProps) {
  const { data } = useSWR('/api/documents/list', fetcher, { fallbackData: { documents: initialDocs } });
  const [uploading, setUploading] = useState(false);

  const documents = data?.documents ?? initialDocs;

  const onUpload = async () => {
    try {
      setUploading(true);
      const res = await fetch('/api/documents/start-upload', { method: 'POST' });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Failed to start upload');
      await fetch('/api/documents/complete', {
        method: 'POST',
        body: JSON.stringify({ uploadId: payload.uploadId }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const onSign = async (documentId: string) => {
    await signDocument(documentId);
  };

  const onDownload = async (documentId: string) => {
    await downloadFile(documentId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Your documents</h2>
        <Button onClick={onUpload} disabled={uploading} className="gap-2">
          <UploadCloud className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload to Google Drive'}
        </Button>
      </div>
      <div className="grid gap-4">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-lg font-medium">{doc.filename}</p>
                <p className="text-xs text-slate-500">Checksum: {doc.checksum ?? 'n/a'}</p>
              </div>
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
                  doc.signatureStatus === 'signed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                )}
              >
                <ShieldCheck className="h-3 w-3" />
                {doc.signatureStatus === 'signed' ? 'Signed' : 'Awaiting signature'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => onDownload(doc.id)}>
                Download
              </Button>
              {doc.signatureStatus !== 'signed' && (
                <Button onClick={() => onSign(doc.id)}>Sign document</Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <aside className="rounded-lg bg-white p-4 shadow">
        <h3 className="text-lg font-semibold">Clan organization</h3>
        <p className="text-sm text-slate-600">
          Documents are grouped into secure Google Drive folders for each clan.
        </p>
        <ul className="mt-2 grid grid-cols-2 gap-1 text-sm">
          {clans.map((clan) => (
            <li key={clan.value} className="text-slate-600">
              • {clan.label}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
