import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const expired = await prisma.retentionPolicy.findMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      },
      include: {
        document: true
      }
    });

    for (const policy of expired) {
      await prisma.auditLog.create({
        data: {
          actorId: 'system',
          action: 'retention.flag',
          resourceId: policy.documentId,
          metadata: JSON.stringify({ policyId: policy.id })
        }
      });
    }

    return NextResponse.json({ processed: expired.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}
