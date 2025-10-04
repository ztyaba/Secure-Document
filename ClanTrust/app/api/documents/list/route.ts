import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: { ownerUserId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 });
  }
}
