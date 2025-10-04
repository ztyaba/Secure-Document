import { prisma } from './prisma';
import { headers } from 'next/headers';

export type AuditEvent = {
  actorId: string | null;
  action: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
};

export async function logAudit(event: AuditEvent) {
  const forwarded = headers().get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] ?? 'unknown';

  await prisma.auditLog.create({
    data: {
      actorId: event.actorId,
      action: event.action,
      resourceId: event.resourceId,
      ipAddress: ip,
      metadata: event.metadata ? JSON.stringify(event.metadata) : undefined
    }
  });
}

export async function getAuditCsv() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const header = 'timestamp,actorId,action,resourceId,ipAddress,metadata\n';
  const rows = logs
    .map((log) =>
      [
        log.createdAt.toISOString(),
        log.actorId ?? '',
        log.action,
        log.resourceId ?? '',
        log.ipAddress ?? '',
        log.metadata ?? ''
      ]
        .map((value) => `"${value.replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  return header + rows;
}
