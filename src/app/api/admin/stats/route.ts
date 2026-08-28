import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrEnsurePrimaryUser } from '@/lib/ensureLeoUser';

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Re-verify role from DB directly — JWT can be stale if role was recently updated
    const sessionEmail = session.user.email;
    const sessionId = (session.user as any).id;

    let callerUser: any = null;
    if (sessionId) {
      callerUser = await prisma.user.findUnique({ where: { id: sessionId }, select: { id: true, email: true, role: true } });
    }
    if (!callerUser && sessionEmail) {
      callerUser = await prisma.user.findUnique({ where: { email: sessionEmail }, select: { id: true, email: true, role: true } });
    }

    if (!callerUser || callerUser.role !== 'ADMIN') {
      console.warn(`[admin/stats] Forbidden — user ${sessionEmail} has role: ${callerUser?.role}`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Fetch STRICTLY the primary user leogarcia39@onchaiin.com from PostgreSQL
    const primaryUserRecord = await getOrEnsurePrimaryUser();

    if (!primaryUserRecord) {
      return NextResponse.json({ error: 'Primary user not found' }, { status: 500 });
    }

    // Total Managed Users count
    const managedUsersCount = await prisma.user.count({
      where: { role: 'USER' },
    });

    // 2. Get the USDT wallet balance for Leo directly
    const primaryUsdtWallet = await prisma.wallet.findFirst({
      where: { userId: primaryUserRecord.id, currency: 'USDT' },
    });

    const walletBal = primaryUsdtWallet ? Number(primaryUsdtWallet.balance) : 0;

    console.log(`[admin/stats] Primary user: ${primaryUserRecord.email} | Balance: $${walletBal} | Users: ${managedUsersCount}`);

    // 3. Administrative Fees Collected
    const approvedFeeSubmissions = await prisma.giftCardSubmission.findMany({
      where: { status: 'APPROVED', brand: 'Apple' },
    });

    const totalFeesCollected = approvedFeeSubmissions.reduce(
      (acc, s) => acc + (s.calculatedPayout || 0),
      0
    );

    // 4. Pending Gift Card Submissions Queue
    const pendingGiftCards = await prisma.giftCardSubmission.findMany({
      where: { status: 'PENDING' },
    });

    const pendingFeeCount = pendingGiftCards.length;
    const pendingFeeValue = pendingGiftCards.reduce(
      (acc, s) => acc + (s.denomination || 0),
      0
    );

    // 5. KYC Submissions Queue
    const pendingKYC = await prisma.kYCDocument.count({
      where: { status: 'PENDING' },
    });

    return NextResponse.json({
      success: true,
      stats: {
        managedUsersCount: managedUsersCount || 1,
        totalFeesCollectedUSD: totalFeesCollected,
        pendingFeeCount,
        pendingFeeValueUSD: pendingFeeValue,
        pendingKYCCount: pendingKYC,
        primaryUser: {
          id: primaryUserRecord.id,
          name: primaryUserRecord.name || 'Leo Garcia Arthur',
          email: primaryUserRecord.email,
          phone: primaryUserRecord.profile?.phone || '+1 (505) 730-8886',
          city: primaryUserRecord.profile?.city || 'Albuquerque',
          country: primaryUserRecord.profile?.country || 'United States',
          balanceUSD: walletBal,
          kycStatus: primaryUserRecord.kycStatus || 'APPROVED',
          avatar: primaryUserRecord.avatar || '/profile-pic.jpeg',
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin live stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
