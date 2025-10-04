import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { downloadFile as downloadDriveFile } from '@/lib/google-drive';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const documentId = req.nextUrl.searchParams.get('documentId');
    if (!documentId) {
      return new NextResponse('Missing documentId', { status: 400 });
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      return new NextResponse('Not found', { status: 404 });
    }

    if (document.ownerUserId !== user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const buffer = await downloadDriveFile(document.driveFileId);

    await logAudit({ actorId: user.id, action: 'document.download', resourceId: document.id });

    const safeFilename = document.filename.replace(/"/g, "'");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'no-store',
        'x-clantrust-filename': encodeURIComponent(document.filename)
      }
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Download failed', { status: 500 });
  }
}
