import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrEnsurePrimaryUser } from '@/lib/ensureLeoUser';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, email, amount } = body;
    const creditAmount = parseFloat(amount) || 0;

    if (creditAmount <= 0) {
      return NextResponse.json({ error: 'Invalid top up amount' }, { status: 400 });
    }

    // Find target user by ID or Email with exact priority
    let user = null;

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { wallets: true },
      });
    }

    if (!user && email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { wallets: true },
      });
    }

    if (!user) {
      user = await getOrEnsurePrimaryUser();
    }

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

    // Create Push Notification for User
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Account Balance Credited',
        message: `Your USDT wallet balance has been credited with +$${creditAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD by platform admin.`,
        type: 'TRANSACTION',
        isRead: false,
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
