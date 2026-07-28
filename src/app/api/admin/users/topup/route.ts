import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, email, amount } = body;
    const creditAmount = parseFloat(amount) || 0;

    if (creditAmount <= 0) {
      return NextResponse.json({ error: 'Invalid top up amount' }, { status: 400 });
    }

    // Find target user by ID or Email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(email ? [{ email }] : [{ email: 'leogarcia39@onchaiin.com' }]),
        ],
      },
      include: { wallets: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    const userNameClean = (user.name || 'User').replace(/\s+/g, '');

    // Update or Create USDT Wallet for User in PostgreSQL
    const usdtWallet = await prisma.wallet.upsert({
      where: {
        userId_currency: {
          userId: user.id,
          currency: 'USDT',
        },
      },
      update: {
        balance: { increment: creditAmount },
      },
      create: {
        userId: user.id,
        currency: 'USDT',
        balance: creditAmount,
        address: `TR7${userNameClean}UsdtAddress`,
      },
    });

    // Record Wallet Transaction
    await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        walletId: usdtWallet.id,
        type: 'CREDIT',
        amount: creditAmount,
        currency: 'USDT',
        reference: `TOPUP_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        description: 'Admin Real-Time Account Ledger Credit',
        status: 'COMPLETED',
      },
    });

    console.log(`💰 Admin topped up $${creditAmount} USD for user ${user.email}. New Balance: $${usdtWallet.balance} USD`);

    return NextResponse.json({
      success: true,
      newBalance: usdtWallet.balance,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error('Error topping up user balance:', error);
    return NextResponse.json({ error: 'Failed to top up user balance' }, { status: 500 });
  }
}
