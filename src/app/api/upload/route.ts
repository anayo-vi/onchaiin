import { NextResponse } from 'next/server';
import { uploadFileToBucket } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as any) || 'documents';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const publicUrl = await uploadFileToBucket(bucket, buffer, file.name, file.type);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
