import { verifyAdminSession } from '@/lib/adminAuth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const dbWithdrawals = await prisma.cryptoWithdrawal.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedWithdrawals = dbWithdrawals.map((w) => ({
      id: w.id,
      userName: w.user?.name || 'Leo Garcia Arthur',
      userEmail: w.user?.email || 'leogarcia39@onchaiin.com',
      currency: w.currency,
      amount: w.amount,
      fee: w.fee,
      netAmount: w.netAmount,
      destinationAddress: w.destinationAddress,
      status: w.status,
      date: w.createdAt.toISOString().replace('T', ' ').substring(0, 16),
    }));

    return NextResponse.json({ success: true, withdrawals: formattedWithdrawals });
  } catch (error: any) {
    console.error('Error fetching admin withdrawals:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    const existingWithdrawal = await prisma.cryptoWithdrawal.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingWithdrawal) {
      return NextResponse.json({ error: 'Withdrawal record not found' }, { status: 404 });
    }

    const updated = await prisma.cryptoWithdrawal.update({
      where: { id },
      data: { status },
    });

    // If withdrawal status is changed to COMPLETED or APPROVED -> Deduct user balance in PostgreSQL DB
    if (
      (status === 'COMPLETED' || status === 'APPROVED') &&
      existingWithdrawal.status !== 'COMPLETED' &&
      existingWithdrawal.status !== 'APPROVED'
    ) {
      const userId = existingWithdrawal.userId;
      const amountToDeduct = existingWithdrawal.amount;

      const usdtWallet = await prisma.wallet.findUnique({
        where: {
          userId_currency: {
            userId,
            currency: existingWithdrawal.currency || 'USDT',
          },
        },
      });

      if (usdtWallet && amountToDeduct > 0) {
        const newBalance = Math.max(0, usdtWallet.balance - amountToDeduct);

        await prisma.wallet.update({
          where: { id: usdtWallet.id },
          data: { balance: newBalance },
        });

        await prisma.walletTransaction.updateMany({
          where: {
            userId,
            status: 'PENDING',
            type: 'WITHDRAWAL',
          },
          data: { status: 'COMPLETED' },
        });

        await prisma.notification.create({
          data: {
            userId,
            title: 'Withdrawal Completed',
            message: `Your withdrawal of $${amountToDeduct.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${existingWithdrawal.currency} has been approved and processed. Your wallet balance is now $${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
            type: 'TRANSACTION',
            isRead: false,
          },
        });

        console.log(`✅ [Withdrawal Approval] Deducted $${amountToDeduct} from user ${existingWithdrawal.user?.email}. New balance: $${newBalance}`);
      }
    }

    return NextResponse.json({ success: true, withdrawal: updated });
  } catch (error: any) {
    console.error('Error updating withdrawal status:', error);
    return NextResponse.json({ error: 'Failed to update withdrawal status' }, { status: 500 });
  }
}
