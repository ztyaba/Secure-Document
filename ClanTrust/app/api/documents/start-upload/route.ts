import { Buffer } from 'node:buffer';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { uploadPlaceholderFile } from '@/lib/google-drive';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    const org = profile?.clan ?? 'akasolya';

    const content = Buffer.from(`Sample document generated at ${new Date().toISOString()}`);
    const filename = `will-${Date.now()}.pdf`;
    const { fileId, checksum } = await uploadPlaceholderFile({ org, userId: user.id, filename, content });

    const document = await prisma.document.create({
      data: {
        ownerUserId: user.id,
        driveFileId: fileId,
        filename,
        signatureStatus: 'draft',
        checksum
      }
    });

    await logAudit({
      actorId: user.id,
      action: 'document.upload.start',
      resourceId: document.id,
      metadata: { fileId }
    });

    return NextResponse.json({ uploadId: document.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
