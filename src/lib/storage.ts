import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export async function uploadFileToBucket(
  bucketName: 'avatars' | 'giftcards' | 'kyc' | 'documents' | 'proofs',
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const fileExt = path.extname(fileName) || '.png';
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;

  // If Supabase is configured, upload to Supabase Storage bucket
  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(uniqueName, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uniqueName);
        return publicUrlData.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to local static storage:', err);
    }
  }

  // Fallback to local filesystem /uploads/ directory
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', bucketName);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, fileBuffer);
    return `/uploads/${bucketName}/${uniqueName}`;
  } catch (err) {
    console.error('Local upload failed:', err);
    // Return placeholder base64 / default image
    return `https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500`;
  }
}
