import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getAuditCsv } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const role = (user.publicMetadata.role as string | undefined) ?? 'client';
    if (!['admin', 'paralegal', 'notary'].includes(role)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const csv = await getAuditCsv();
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="audit-log.csv"'
      }
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Export failed', { status: 500 });
  }
}
