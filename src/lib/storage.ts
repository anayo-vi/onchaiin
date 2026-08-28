import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export async function uploadFileToBucket(
  folderName: string = 'documents',
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const fileExt = path.extname(fileName) || '.png';
  const uniquePath = `${folderName}/${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;
  const bucketName = 'onchaiin-uploads';

  // 1. Upload directly to Supabase Storage bucket 'onchaiin-uploads' (with 4-second timeout)
  if (supabase) {
    try {
      const uploadPromise = supabase.storage
        .from(bucketName)
        .upload(uniquePath, fileBuffer, {
          contentType: contentType || 'image/png',
          upsert: true,
        });

      const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Supabase storage timeout (4s)' } }), 4000)
      );

      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uniquePath);

        console.log(`✅ Uploaded file to Supabase bucket "${bucketName}/${uniquePath}":`, publicUrlData.publicUrl);
        return publicUrlData.publicUrl;
      } else if (error) {
        console.warn('Supabase storage upload error:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase storage upload failed:', err?.message || err);
    }
  }

  // 2. Fallback to local filesystem /public/uploads/ directory (if environment permits)
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folderName);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const localFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = path.join(uploadDir, localFileName);
    fs.writeFileSync(filePath, fileBuffer);
    return `/uploads/${folderName}/${localFileName}`;
  } catch (err) {
    console.warn('Local file write skipped:', err);
  }

  // 3. Fallback: Return optimized base64 Data URL
  const mimeType = contentType || 'image/png';
  const base64Data = fileBuffer.toString('base64');
  return `data:${mimeType};base64,${base64Data}`;
}
