import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { uploadId } = await req.json();
    if (!uploadId) {
      return NextResponse.json({ error: 'Missing uploadId' }, { status: 400 });
    }

    const document = await prisma.document.update({
      where: { id: uploadId },
      data: {
        signatureStatus: 'pending'
      }
    });

    await logAudit({
      actorId: user.id,
      action: 'document.upload.complete',
      resourceId: document.id
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Completion failed' }, { status: 500 });
  }
}
