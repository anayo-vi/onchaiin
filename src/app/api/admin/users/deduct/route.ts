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
    const { userId, email, amount, reason = 'Administrative Processing Fee' } = body;
    const deductAmount = parseFloat(amount) || 0;

    if (deductAmount <= 0) {
      return NextResponse.json({ error: 'Invalid deduction amount' }, { status: 400 });
    }

    // Find target user by ID or Email with fallback
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

    // Get or Create USDT Wallet for User in PostgreSQL
    const usdtWallet = await prisma.wallet.upsert({
      where: {
        userId_currency: {
          userId: user.id,
          currency: 'USDT',
        },
      },
      update: {
        balance: { decrement: deductAmount },
      },
      create: {
        userId: user.id,
        currency: 'USDT',
        balance: 0,
        address: `TR7${userNameClean}UsdtAddress`,
      },
    });

    // Record Debit Wallet Transaction in PostgreSQL
    await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        walletId: usdtWallet.id,
        type: 'DEBIT',
        amount: deductAmount,
        currency: 'USDT',
        reference: `DEDUCT_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        description: `Admin Account Charge: ${reason}`,
        status: 'COMPLETED',
      },
    });

    // Create Push Notification for User
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Account Ledger Charge Deducted',
        message: `An administrative charge of -$${deductAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD (${reason}) has been debited from your USDT wallet.`,
        type: 'TRANSACTION',
        isRead: false,
      },
    });

    console.log(`💸 Admin deducted $${deductAmount} USD from user ${user.email} (${reason}). New Balance: $${usdtWallet.balance} USD`);

    return NextResponse.json({
      success: true,
      newBalance: Math.max(0, usdtWallet.balance),
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error('Error deducting charges from user balance:', error);
    return NextResponse.json({ error: 'Failed to deduct charges' }, { status: 500 });
  }
}
