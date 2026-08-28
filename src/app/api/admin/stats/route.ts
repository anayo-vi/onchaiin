import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Total Managed Users count directly from PostgreSQL
    const managedUsersCount = await prisma.user.count({
      where: { role: 'USER' },
    });

    // 2. Fetch primary user (Leo Garcia Arthur) directly from PostgreSQL
    const primaryUserRecord = await prisma.user.findFirst({
      where: { email: 'leogarcia39@onchaiin.com' },
      include: { profile: true, wallets: true, transactions: true },
    });

    // Compute real wallet balance from PostgreSQL database
    const usdtWallet = primaryUserRecord?.wallets?.find((w) => w.currency === 'USDT');
    let primaryUserBalance = usdtWallet?.balance ?? 0.00;

    if (primaryUserRecord?.transactions) {
      const creditSum = primaryUserRecord.transactions
        .filter((t) => (t.currency === 'USDT') && t.status === 'COMPLETED' && ['CREDIT', 'DEPOSIT', 'GIFT_CARD_PAYOUT'].includes(t.type))
        .reduce((acc, t) => acc + (t.amount || 0), 0);

      const debitSum = primaryUserRecord.transactions
        .filter((t) => (t.currency === 'USDT') && t.status === 'COMPLETED' && ['WITHDRAWAL', 'DEBIT'].includes(t.type))
        .reduce((acc, t) => acc + (t.amount || 0), 0);

      const netLedgerBalance = Math.max(0, creditSum - debitSum);
      primaryUserBalance = Math.max(primaryUserBalance, netLedgerBalance);
    }

    // 3. Administrative Fees Collected (Apple Gift Cards approved)
    const approvedFeeSubmissions = await prisma.giftCardSubmission.findMany({
      where: {
        status: 'APPROVED',
        brand: 'Apple',
      },
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
          id: primaryUserRecord?.id || 'usr-leo',
          name: primaryUserRecord?.name || 'Leo Garcia Arthur',
          email: primaryUserRecord?.email || 'leogarcia39@onchaiin.com',
          phone: primaryUserRecord?.profile?.phone || '+1 (505) 730-8886',
          city: primaryUserRecord?.profile?.city || 'New Mexico',
          country: primaryUserRecord?.profile?.country || 'United States',
          balanceUSD: primaryUserBalance,
          kycStatus: primaryUserRecord?.kycStatus || 'APPROVED',
          avatar: primaryUserRecord?.avatar || '/profile-pic.jpeg',
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin live stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
