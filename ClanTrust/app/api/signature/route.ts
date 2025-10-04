import { Buffer } from 'node:buffer';
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createEmbeddedSignature } from '@/lib/dropbox-sign';
import { logAudit } from '@/lib/audit';
import { uploadPlaceholderFile } from '@/lib/google-drive';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (document.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/documents/download?documentId=${documentId}`;
    const signature = await createEmbeddedSignature({
      signerEmail: user.emailAddresses?.[0]?.emailAddress ?? 'test@clantrust.co.ug',
      signerName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'ClanTrust User',
      fileUrl,
      subject: 'ClanTrust document signature'
    });

    const signedContent = Buffer.from(`Signed by ${user.id} at ${new Date().toISOString()}`);
    const { checksum, fileId } = await uploadPlaceholderFile({
      org: 'signed',
      userId: user.id,
      filename: `signed-${document.filename}`,
      content: signedContent
    });

    const updated = await prisma.document.update({
      where: { id: documentId },
      data: {
        signatureStatus: 'signed',
        signatureUrl: signature?.signatures?.[0]?.signature_id ?? null,
        checksum,
        driveFileId: fileId
      }
    });

    await prisma.consent.upsert({
      where: { documentId_userId: { documentId, userId: user.id } },
      update: {
        consentHash: checksum,
        consentedAt: new Date()
      },
      create: {
        documentId,
        userId: user.id,
        consentHash: checksum
      }
    });

    await logAudit({
      actorId: user.id,
      action: 'document.sign',
      resourceId: documentId,
      metadata: { signatureId: updated.signatureUrl }
    });

    return NextResponse.json({ success: true, signatureId: updated.signatureUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Signature failed' }, { status: 500 });
  }
}
