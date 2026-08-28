import { verifyAdminSession } from '@/lib/adminAuth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, message, targetGroup = 'ALL' } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    // Determine which users to notify
    let whereClause: any = {};
    if (targetGroup === 'KYC_VERIFIED') {
      whereClause = { kycStatus: 'APPROVED' };
    } else if (targetGroup === 'UNVERIFIED') {
      whereClause = { kycStatus: 'UNVERIFIED' };
    }

    const users = await prisma.user.findMany({
      where: { role: 'USER', ...whereClause },
      select: { id: true },
    });

    if (users.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'No users matched the target group' });
    }

    // Create notifications for all target users
    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        title,
        message,
        type: 'SYSTEM',
        isRead: false,
      })),
    });

    console.log(`📢 Admin broadcast sent to ${users.length} users: "${title}"`);

    return NextResponse.json({ success: true, sent: users.length });
  } catch (error: any) {
    console.error('Error sending broadcast:', error);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}
