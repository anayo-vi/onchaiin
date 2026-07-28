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
    const deposits = await prisma.cryptoDeposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ deposits });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currency, amount } = await req.json();
    const userId = session.user.id as string;

    const wallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const deposit = await prisma.cryptoDeposit.create({
      data: {
        userId,
        walletId: wallet.id,
        currency,
        amount: parseFloat(amount),
        toAddress: wallet.address,
        txHash: '0x' + Math.random().toString(36).substring(2, 15),
        status: 'CONFIRMED',
        confirmations: 3,
        requiredConfirmations: 3,
      },
    });

    // Credit wallet balance
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: parseFloat(amount) } },
    });

    // Record transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'DEPOSIT',
        amount: parseFloat(amount),
        currency,
        status: 'COMPLETED',
        reference: `TX-DEP-${Date.now()}`,
        description: `Direct ${currency} Deposit Confirmed`,
      },
    });

    return NextResponse.json({ success: true, deposit });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process deposit' }, { status: 500 });
  }
}
