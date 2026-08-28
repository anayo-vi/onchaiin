import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
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
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    const updated = await prisma.cryptoWithdrawal.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, withdrawal: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update withdrawal status' }, { status: 500 });
  }
}
