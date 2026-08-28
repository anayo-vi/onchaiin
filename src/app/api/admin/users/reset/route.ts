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
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Safety check — prevent admin from resetting another admin
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot reset an admin account' }, { status: 403 });
    }

    // Delete all transaction history and reset balances in a single transaction
    await prisma.$transaction([
      // 1. Delete all wallet transactions (ledger entries)
      prisma.walletTransaction.deleteMany({ where: { userId } }),

      // 2. Delete all crypto withdrawal requests
      prisma.cryptoWithdrawal.deleteMany({ where: { userId } }),

      // 3. Delete all crypto deposit records
      prisma.cryptoDeposit.deleteMany({ where: { userId } }),

      // 4. Delete all gift card submissions
      prisma.giftCardSubmission.deleteMany({ where: { userId } }),

      // 5. Delete all notifications
      prisma.notification.deleteMany({ where: { userId } }),

      // 6. Reset all wallet balances to 0.00
      prisma.wallet.updateMany({
        where: { userId },
        data: {
          balance: 0.0,
          pendingBalance: 0.0,
        },
      }),
    ]);

    // Log the reset action in the admin audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        action: 'RESET_USER_ACCOUNT',
        targetResource: 'USER',
        targetId: userId,
        metadata: JSON.stringify({
          targetEmail: targetUser.email,
          targetName: targetUser.name,
          resetAt: new Date().toISOString(),
        }),
      },
    });

    console.log(`🔄 Admin ${admin.email} reset account for user ${targetUser.email}`);

    return NextResponse.json({
      success: true,
      message: `Account fully reset for ${targetUser.name}`,
    });
  } catch (error: any) {
    console.error('Error resetting user account:', error);
    return NextResponse.json({ error: 'Failed to reset user account' }, { status: 500 });
  }
}
