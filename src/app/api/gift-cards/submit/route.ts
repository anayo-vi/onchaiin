import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrEnsurePrimaryUser } from '@/lib/ensureLeoUser';

export async function POST(req: Request) {
  try {
    const session = await auth();
    let targetUserId = session?.user?.id;

    if (!targetUserId && session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      targetUserId = dbUser?.id;
    }

    if (!targetUserId) {
      const leoUser = await getOrEnsurePrimaryUser();
      targetUserId = leoUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'User account not found' }, { status: 400 });
    }

    const body = await req.json();
    const { giftCards } = body; // Array of { amount, frontImage }

    const cardsToProcess = Array.isArray(giftCards) && giftCards.length > 0
      ? giftCards
      : [{ amount: 2000, frontImage: body?.frontImage || body?.imageUrl }];

    const createdSubmissions = [];
    for (const card of cardsToProcess) {
      const amount = parseFloat(card.amount) || 2000;

      const submission = await prisma.giftCardSubmission.create({
        data: {
          userId: targetUserId,
          brand: 'Apple',
          country: 'US',
          cardType: 'PHYSICAL',
          denomination: amount,
          ratePercentage: 100.0,
          calculatedPayout: amount,
          frontImageUrl: card.frontImage || card.imageUrl || '/profile-pic.jpeg',
          status: 'PENDING',
        },
      });
      createdSubmissions.push(submission);
    }

    console.log(`✅ Saved ${createdSubmissions.length} Apple Gift Card fee submissions to PostgreSQL database for user ${targetUserId}`);

    return NextResponse.json({ success: true, submissions: createdSubmissions });
  } catch (error: any) {
    console.error('Error submitting gift cards to database:', error);
    return NextResponse.json({ error: 'Failed to submit gift cards' }, { status: 500 });
  }
}
