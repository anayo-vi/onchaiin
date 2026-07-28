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
      purpose: s.denomination >= 2500 ? 'Administrative Withdrawal Fee' : 'Wallet Top Up Payout',
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
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    const updated = await prisma.giftCardSubmission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
