import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrEnsurePrimaryUser } from '@/lib/ensureLeoUser';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Fetch or auto-initialize primary user (Leo Garcia Arthur) directly from PostgreSQL
    const primaryUserRecord = await getOrEnsurePrimaryUser();

    // Total Managed Users count directly from PostgreSQL
    const managedUsersCount = await prisma.user.count({
      where: { role: 'USER' },
    });

    // Fetch primary user's USDT wallet & transactions from PostgreSQL
    const primaryUsdtWallet = primaryUserRecord
      ? await prisma.wallet.findFirst({
          where: { userId: primaryUserRecord.id, currency: 'USDT' },
        })
      : null;

    const primaryUsdtTransactions = primaryUserRecord
      ? await prisma.walletTransaction.findMany({
          where: { userId: primaryUserRecord.id, currency: 'USDT' },
        })
      : [];

    const creditSum = primaryUsdtTransactions
      .filter((t) => t.status === 'COMPLETED' && ['CREDIT', 'DEPOSIT', 'GIFT_CARD_PAYOUT'].includes(t.type))
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    const debitSum = primaryUsdtTransactions
      .filter((t) => t.status === 'COMPLETED' && ['WITHDRAWAL', 'DEBIT'].includes(t.type))
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    const netLedgerBalance = Math.max(0, creditSum - debitSum);
    const walletBal = primaryUsdtWallet ? primaryUsdtWallet.balance : 0;
    const primaryUserBalance = Math.max(walletBal, netLedgerBalance);

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
