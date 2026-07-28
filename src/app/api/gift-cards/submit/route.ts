import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { giftCards } = body; // Array of { amount, frontImage }

    if (!Array.isArray(giftCards) || giftCards.length === 0) {
      return NextResponse.json({ error: 'No gift cards provided' }, { status: 400 });
    }

    const createdSubmissions = [];
    for (const card of giftCards) {
      const amount = parseFloat(card.amount) || 0;
      if (amount <= 0) continue;

      const submission = await prisma.giftCardSubmission.create({
        data: {
          userId: session.user.id,
          brand: 'Apple',
          country: 'US',
          cardType: 'PHYSICAL',
          denomination: amount,
          ratePercentage: 100.0,
          calculatedPayout: amount,
          frontImageUrl: card.frontImage || '/profile-pic.jpeg',
          status: 'PENDING',
        },
      });
      createdSubmissions.push(submission);
    }

    console.log(`✅ Saved ${createdSubmissions.length} user Apple Gift Card submissions to PostgreSQL database for user ${session.user.id}`);

    return NextResponse.json({ success: true, submissions: createdSubmissions });
  } catch (error: any) {
    console.error('Error submitting gift cards:', error);
    return NextResponse.json({ error: 'Failed to submit gift cards' }, { status: 500 });
  }
}
