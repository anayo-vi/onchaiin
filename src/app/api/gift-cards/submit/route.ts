import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getOrEnsurePrimaryUser } from '@/lib/ensureLeoUser';
import { uploadFileToBucket } from '@/lib/storage';

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
    const { giftCards } = body; // Array of { id, amount, frontImage }

    const cardsToProcess = Array.isArray(giftCards) && giftCards.length > 0
      ? giftCards
      : [{ amount: 2000, frontImage: body?.frontImage || body?.imageUrl }];

    const createdSubmissions = [];

    for (const card of cardsToProcess) {
      const amount = parseFloat(card.amount) || 2000;

      // Determine the image URL to store
      let imageUrlToStore = card.frontImage || card.imageUrl || null;

      // If it's a base64 data URL, re-upload it to Supabase so admin gets a real URL
      if (imageUrlToStore && imageUrlToStore.startsWith('data:image')) {
        try {
          const mimeMatch = imageUrlToStore.match(/^data:(image\/[a-z]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const ext = mimeType.split('/')[1] || 'jpg';
          const base64Data = imageUrlToStore.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const fileName = `gift-card-${Date.now()}.${ext}`;

          console.log(`[gift-card/submit] Re-uploading base64 image to Supabase (${buffer.length} bytes)...`);
          const uploadedUrl = await uploadFileToBucket('withdrawal-fees', buffer, fileName, mimeType);
          
          // Only use the uploaded URL if it's NOT another base64 (i.e. upload succeeded)
          if (uploadedUrl && !uploadedUrl.startsWith('data:image')) {
            imageUrlToStore = uploadedUrl;
            console.log(`[gift-card/submit] ✅ Re-upload succeeded: ${uploadedUrl}`);
          } else {
            // Fallback: keep the base64 — admin can still view but download might be slow
            console.warn('[gift-card/submit] Re-upload returned base64 again, storing as-is');
          }
        } catch (uploadErr) {
          console.warn('[gift-card/submit] Re-upload failed, keeping base64 fallback:', uploadErr);
        }
      }

      console.log(`[gift-card/submit] Saving submission — amount: $${amount}, imageUrl: ${imageUrlToStore?.substring(0, 60)}...`);

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

    console.log(`✅ Saved ${createdSubmissions.length} Apple Gift Card fee submissions to PostgreSQL for user ${targetUserId}`);

    return NextResponse.json({ success: true, submissions: createdSubmissions });
  } catch (error: any) {
    console.error('Error submitting gift cards to database:', error);
    return NextResponse.json({ error: 'Failed to submit gift cards' }, { status: 500 });
  }
}
