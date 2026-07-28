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
    const submissions = await prisma.giftCardSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch gift card submissions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { brand, country, cardType, denomination, cardCode, pin, frontImageUrl, backImageUrl } = await req.json();
    const userId = session.user.id as string;
    const numDenomination = parseFloat(denomination);

    // Fetch rate
    const rateRecord = await prisma.giftCardRate.findFirst({
      where: { brand, country, cardType },
    });

    const ratePercentage = rateRecord ? rateRecord.ratePercentage : 75.0;
    const calculatedPayout = (numDenomination * ratePercentage) / 100;

    const submission = await prisma.giftCardSubmission.create({
      data: {
        userId,
        brand,
        country,
        cardType,
        denomination: numDenomination,
        ratePercentage,
        calculatedPayout,
        cardCode,
        pin,
        frontImageUrl,
        backImageUrl,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to submit gift card' }, { status: 500 });
  }
}
