import { verifyAdminSession } from '@/lib/adminAuth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deposits = await prisma.cryptoDeposit.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = deposits.map((d) => ({
      id: d.id,
      userName: d.user?.name || 'Unknown',
      userEmail: d.user?.email || 'N/A',
      currency: d.currency,
      amount: d.amount,
      txHash: d.txHash || 'N/A',
      confirmations: `${d.confirmations} / ${d.requiredConfirmations}`,
      status: d.status,
      date: d.createdAt.toISOString().replace('T', ' ').substring(0, 16),
    }));

    return NextResponse.json({ success: true, deposits: formatted });
  } catch (error: any) {
    console.error('Error fetching deposits:', error);
    return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
  }
}
