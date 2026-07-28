import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, title, message, category } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    // Resolve target user — find by userId or fall back to primary user
    let targetUserId = userId;
    if (!targetUserId) {
      const primaryUser = await prisma.user.findFirst({
        where: { role: 'USER' },
        select: { id: true },
      });
      if (!primaryUser) {
        return NextResponse.json({ error: 'No target user found' }, { status: 404 });
      }
      targetUserId = primaryUser.id;
    }

    // Write notification to PostgreSQL
    const notification = await prisma.notification.create({
      data: {
        userId: targetUserId,
        title,
        message,
        type: category || 'SYSTEM',
        isRead: false,
      },
    });

    console.log(`🔔 Admin sent notification to user ${targetUserId}: "${title}"`);

    return NextResponse.json({ success: true, notification });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
