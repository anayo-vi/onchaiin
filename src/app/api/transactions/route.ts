import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Fetch all transaction types in parallel
    const [walletTxs, withdrawals, deposits, giftCards] = await Promise.all([
      // Wallet ledger transactions (credits, debits, adjustments)
      prisma.walletTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),

      // Crypto withdrawal requests
      prisma.cryptoWithdrawal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),

      // Crypto deposit history
      prisma.cryptoDeposit.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),

      // Gift card submissions
      prisma.giftCardSubmission.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    // Normalize all transactions into a unified format
    const unified: any[] = [];

    walletTxs.forEach((tx) => {
      unified.push({
        id: tx.id,
        category: 'WALLET',
        type: tx.type,
        description: tx.description || tx.type,
        amount: tx.amount,
        currency: tx.currency,
        fee: tx.fee,
        status: tx.status,
        reference: tx.reference,
        createdAt: tx.createdAt.toISOString(),
        meta: {},
      });
    });

    withdrawals.forEach((w) => {
      unified.push({
        id: w.id,
        category: 'WITHDRAWAL',
        type: 'WITHDRAWAL',
        description: `${w.currency} Withdrawal`,
        amount: w.amount,
        currency: w.currency,
        fee: w.fee,
        netAmount: w.netAmount,
        status: w.status,
        reference: w.id,
        createdAt: w.createdAt.toISOString(),
        meta: {
          destinationAddress: w.destinationAddress,
          rejectionReason: w.rejectionReason,
          txHash: w.txHash,
        },
      });
    });

    deposits.forEach((d) => {
      unified.push({
        id: d.id,
        category: 'DEPOSIT',
        type: 'DEPOSIT',
        description: `${d.currency} Deposit`,
        amount: d.amount,
        currency: d.currency,
        fee: 0,
        status: d.status,
        reference: d.txHash || d.id,
        createdAt: d.createdAt.toISOString(),
        meta: {
          fromAddress: d.fromAddress,
          toAddress: d.toAddress,
          confirmations: d.confirmations,
          txHash: d.txHash,
        },
      });
    });

    giftCards.forEach((g) => {
      unified.push({
        id: g.id,
        category: 'GIFT_CARD',
        type: 'GIFT_CARD_SUBMISSION',
        description: `${g.brand} Gift Card — ${g.country}`,
        amount: g.denomination,
        currency: 'USD',
        fee: 0,
        calculatedPayout: g.calculatedPayout,
        status: g.status,
        reference: g.id,
        createdAt: g.createdAt.toISOString(),
        meta: {
          brand: g.brand,
          denomination: g.denomination,
          ratePercentage: g.ratePercentage,
          cardType: g.cardType,
          rejectionReason: g.rejectionReason,
          adminNotes: g.adminNotes,
          frontImageUrl: g.frontImageUrl,
        },
      });
    });

    // Sort all by date descending
    unified.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, transactions: unified });
  } catch (error: any) {
    console.error('Error fetching transaction history:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction history' }, { status: 500 });
  }
}
