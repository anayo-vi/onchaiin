import { NextResponse } from 'next/server';
import { uploadFileToBucket } from '@/lib/storage';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'documents';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 50MB file size limit check (50 * 1024 * 1024 bytes)
    const MAX_SIZE_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit. Please upload a smaller image under 50MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase storage bucket 'onchaiin-uploads'
    const publicUrl = await uploadFileToBucket(bucket, buffer, file.name, file.type);

    // If uploading user avatar and user is logged in, persist to PostgreSQL database
    if (bucket === 'avatars' && session?.user?.id) {
      try {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { avatar: publicUrl },
        });
        console.log(`👤 Updated database avatar for user ${session.user.id} to: ${publicUrl}`);
      } catch (dbErr) {
        console.warn('Could not persist avatar to database:', dbErr);
      }
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Upload failed due to server error' }, { status: 500 });
  }
}
