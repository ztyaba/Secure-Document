'use client';

export async function downloadFile(documentId: string) {
  const res = await fetch(`/api/documents/download?documentId=${documentId}`);
  if (!res.ok) {
    throw new Error('Failed to download file');
  }

  const encodedFilename = res.headers.get('x-clantrust-filename');
  const resolvedFilename = encodedFilename
    ? decodeURIComponent(encodedFilename)
    : `${documentId}.pdf`;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = resolvedFilename;
  link.click();
  URL.revokeObjectURL(url);
}
