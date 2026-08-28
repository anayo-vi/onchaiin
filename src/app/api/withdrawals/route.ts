import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrEnsurePrimaryUser } from '@/lib/ensureLeoUser';

export async function GET() {
  try {
    const session = await auth();
    let user = null;

    if (session?.user?.id) {
      user = await prisma.user.findUnique({ where: { id: session.user.id } });
    }
    if (!user && session?.user?.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    if (!user) {
      user = await getOrEnsurePrimaryUser();
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const withdrawals = await prisma.cryptoWithdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, withdrawals });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    let user = null;

    if (session?.user?.id) {
      user = await prisma.user.findUnique({ where: { id: session.user.id } });
    }
    if (!user && session?.user?.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    if (!user) {
      user = await getOrEnsurePrimaryUser();
    }

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 400 });
    }

    const body = await req.json();
    const { currency = 'USDT', amount, destinationAddress, payoutMethod, fullName, address, deliveryPhone } = body;
    const numAmount = parseFloat(amount) || 0;

    if (numAmount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
    }

    const selectedCurrency = (currency || 'USDT').toUpperCase();

    // Ensure wallet exists for user
    const wallet = await prisma.wallet.upsert({
      where: {
        userId_currency: {
          userId: user.id,
          currency: selectedCurrency,
        },
      },
      update: {},
      create: {
        userId: user.id,
        currency: selectedCurrency,
        balance: 0,
        address: destinationAddress || `TR7${(user.name || 'User').replace(/\s+/g, '')}UsdtAddress`,
      },
    });

    const fee = selectedCurrency === 'USDT' ? 2.5 : selectedCurrency === 'BTC' ? 0.0002 : 0.002;
    const netAmount = Math.max(0, numAmount - fee);
    const destAddr = destinationAddress || address || 'Cash Delivery Address';

    // 1. Create CryptoWithdrawal record in PostgreSQL
    const withdrawal = await prisma.cryptoWithdrawal.create({
      data: {
        userId: user.id,
        walletId: wallet.id,
        currency: selectedCurrency,
        amount: numAmount,
        fee,
        netAmount,
        destinationAddress: destAddr,
        status: 'PENDING',
      },
    });

    // 2. Record WalletTransaction (debit) in PostgreSQL
    await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        walletId: wallet.id,
        type: 'WITHDRAWAL',
        amount: numAmount,
        currency: selectedCurrency,
        reference: `WITHDRAW_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        description: payoutMethod === 'CASH_DELIVERY'
          ? `Cash Delivery Withdrawal Request (${address || 'Home Address'})`
          : `Crypto Withdrawal Request to ${destAddr}`,
        status: 'PENDING',
      },
    });

    // 3. Create Notification in PostgreSQL
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Withdrawal Request Submitted',
        message: `Your withdrawal request of $${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD via ${payoutMethod || 'Crypto'} is currently pending administrative verification.`,
        type: 'TRANSACTION',
        isRead: false,
      },
    });

    console.log(`📤 Withdrawal request of $${numAmount} ${selectedCurrency} created in PostgreSQL DB for user ${user.email}`);

    return NextResponse.json({ success: true, withdrawal });
  } catch (error: any) {
    console.error('Error creating withdrawal in DB:', error);
    return NextResponse.json({ error: 'Failed to create withdrawal request' }, { status: 500 });
  }
}
