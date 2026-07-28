const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*"(.*)"\s*$/) || line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    envVars[match[1]] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('Connecting to Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, serviceKey);

async function createStorageBucket() {
  console.log('🚀 Creating public storage bucket: onchaiin-uploads ...');
  
  const { data, error } = await supabase.storage.createBucket('onchaiin-uploads', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('Duplicate')) {
      console.log('✅ Storage bucket "onchaiin-uploads" already exists and is active!');
    } else {
      console.error('❌ Error creating storage bucket:', error.message);
    }
  } else {
    console.log('🎉 Successfully created public storage bucket "onchaiin-uploads"!', data);
  }
}

createStorageBucket();
