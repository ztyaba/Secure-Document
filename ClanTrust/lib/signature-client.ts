'use client';

export async function signDocument(documentId: string) {
  const res = await fetch('/api/signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId })
  });
  if (!res.ok) {
    const payload = await res.json();
    throw new Error(payload.error || 'Failed to sign document');
  }
  return res.json();
}
