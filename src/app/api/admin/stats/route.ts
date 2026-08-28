import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminAuth';

const PRIMARY_USER_EMAIL = 'leogarcia39@onchaiin.com';

export async function GET(req: Request) {
  try {
    // 1. Verify admin session via DB
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch primary user directly by email — no fallback, no create side-effects
    const primaryUser = await prisma.user.findUnique({
      where: { email: PRIMARY_USER_EMAIL },
      include: {
        profile: true,
        wallets: true,
      },
    });

    if (!primaryUser) {
      console.error('[admin/stats] Primary user not found:', PRIMARY_USER_EMAIL);
      return NextResponse.json({ error: 'Primary user not found' }, { status: 404 });
    }

    // 3. Get USDT balance directly from the wallet already included
    const usdtWallet = primaryUser.wallets.find((w) => w.currency === 'USDT');
    const walletBal = usdtWallet ? Number(usdtWallet.balance) : 0;

    // 4. Count ALL non-admin users in DB
    const managedUsersCount = await prisma.user.count({
      where: { role: 'USER' },
    });

    // 5. Administrative Fees Collected (approved Apple gift cards)
    const approvedFeeSubmissions = await prisma.giftCardSubmission.aggregate({
      where: { status: 'APPROVED' },
      _sum: { calculatedPayout: true },
    });
    const totalFeesCollected = approvedFeeSubmissions._sum.calculatedPayout || 0;

    // 6. Pending Gift Card Submissions
    const pendingFeeStats = await prisma.giftCardSubmission.aggregate({
      where: { status: 'PENDING' },
      _count: { id: true },
      _sum: { denomination: true },
    });

    // 7. Pending KYC count
    const pendingKYC = await prisma.kYCDocument.count({
      where: { status: 'PENDING' },
    });

    console.log(`[admin/stats] user=${primaryUser.email} | balance=$${walletBal} | users=${managedUsersCount}`);

    return NextResponse.json({
      success: true,
      stats: {
        managedUsersCount,
        totalFeesCollectedUSD: Number(totalFeesCollected),
        pendingFeeCount: pendingFeeStats._count.id || 0,
        pendingFeeValueUSD: Number(pendingFeeStats._sum.denomination || 0),
        pendingKYCCount: pendingKYC,
        primaryUser: {
          id: primaryUser.id,
          name: primaryUser.name || 'Leo Garcia Arthur',
          email: primaryUser.email,
          phone: primaryUser.profile?.phone || '+1 (505) 730-8886',
          city: primaryUser.profile?.city || 'Albuquerque',
          country: primaryUser.profile?.country || 'United States',
          balanceUSD: walletBal,
          kycStatus: primaryUser.kycStatus || 'APPROVED',
          avatar: primaryUser.avatar || '/profile-pic.jpeg',
          isFrozen: primaryUser.isFrozen || false,
        },
      },
    });
  } catch (error: any) {
    console.error('[admin/stats] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
