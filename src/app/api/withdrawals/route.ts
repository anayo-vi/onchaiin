import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const withdrawals = await prisma.cryptoWithdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ withdrawals });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currency, amount, destinationAddress } = await req.json();
    const userId = session.user.id as string;
    const numAmount = parseFloat(amount);

    const wallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (!wallet || wallet.balance < numAmount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    const fee = currency === 'USDT' ? 2.5 : currency === 'BTC' ? 0.0002 : 0.002;
    const netAmount = Math.max(0, numAmount - fee);

    const withdrawal = await prisma.cryptoWithdrawal.create({
      data: {
        userId,
        walletId: wallet.id,
        currency,
        amount: numAmount,
        fee,
        netAmount,
        destinationAddress,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, withdrawal });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create withdrawal request' }, { status: 500 });
  }
}
