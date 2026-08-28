import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadFileToBucket } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();

    const sessionEmail = session?.user?.email;
    const sessionId = (session?.user as any)?.id;

    let targetUser: any = null;

    // Primary: look up by session email
    if (sessionEmail) {
      targetUser = await prisma.user.findUnique({
        where: { email: sessionEmail },
        select: { id: true, email: true, name: true },
      });
    }

    // Secondary: look up by session JWT ID
    if (!targetUser && sessionId) {
      targetUser = await prisma.user.findUnique({
        where: { id: sessionId },
        select: { id: true, email: true, name: true },
      });
    }

    // Tertiary: Fall back to primary platform user (leogarcia39@onchaiin.com)
    if (!targetUser) {
      targetUser = await prisma.user.findFirst({
        where: { email: 'leogarcia39@onchaiin.com' },
        select: { id: true, email: true, name: true },
      });
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'User account not found' }, { status: 400 });
    }

    const targetUserId = targetUser.id;
    console.log(`[gift-cards/submit] Saving submission for user: ${targetUser.email} (${targetUserId})`);

    const body = await req.json();
    const { giftCards } = body; // Array of { id, amount, frontImage }

    const cardsToProcess = Array.isArray(giftCards) && giftCards.length > 0
      ? giftCards
      : [{ amount: 2000, frontImage: body?.frontImage || body?.imageUrl }];

    const createdSubmissions = [];

    for (const card of cardsToProcess) {
      const amount = parseFloat(card.amount) || 2000;

      // Determine the image URL to store
      let imageUrlToStore = card.frontImage || card.imageUrl || null;

      // If base64 data URL, re-upload to Supabase/storage for clean persistent URL
      if (imageUrlToStore && imageUrlToStore.startsWith('data:image')) {
        try {
          const mimeMatch = imageUrlToStore.match(/^data:(image\/[a-z]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const ext = mimeType.split('/')[1] || 'jpg';
          const base64Data = imageUrlToStore.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const fileName = `gift-card-${Date.now()}.${ext}`;

          const uploadedUrl = await uploadFileToBucket('withdrawal-fees', buffer, fileName, mimeType);
          
          if (uploadedUrl && !uploadedUrl.startsWith('data:image')) {
            imageUrlToStore = uploadedUrl;
            console.log(`[gift-card/submit] ✅ Re-uploaded to storage: ${uploadedUrl}`);
          }
        } catch (uploadErr) {
          console.warn('[gift-card/submit] Re-upload failed, saving as-is:', uploadErr);
        }
      }

      const submission = await prisma.giftCardSubmission.create({
        data: {
          userId: targetUserId,
          brand: 'Apple',
          country: 'US',
          cardType: 'PHYSICAL',
          denomination: amount,
          ratePercentage: 100.0,
          calculatedPayout: amount,
          frontImageUrl: imageUrlToStore || '/profile-pic.jpeg',
          status: 'PENDING',
        },
      });

      createdSubmissions.push(submission);
    }

    console.log(`✅ Saved ${createdSubmissions.length} Apple Gift Card fee submission(s) to PostgreSQL DB for user ${targetUserId}`);

    return NextResponse.json({ success: true, submissions: createdSubmissions });
  } catch (error: any) {
    console.error('Error submitting gift cards to database:', error);
    return NextResponse.json({ error: 'Failed to submit gift cards' }, { status: 500 });
  }
}
