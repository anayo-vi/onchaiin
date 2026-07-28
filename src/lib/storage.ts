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

  // Upload directly to Supabase Storage bucket 'onchaiin-uploads'
  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(uniquePath, fileBuffer, {
          contentType: contentType || 'image/png',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uniquePath);

        console.log(`✅ Uploaded file to Supabase bucket "${bucketName}/${uniquePath}":`, publicUrlData.publicUrl);
        return publicUrlData.publicUrl;
      } else if (error) {
        console.warn('Supabase storage upload error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to local static storage:', err);
    }
  }

  // Fallback to local filesystem /uploads/ directory
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
    console.error('Local upload failed:', err);
    return `https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500`;
  }
}
