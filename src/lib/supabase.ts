import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://eaortvuyhraehgoymohh.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhb3J0dnV5aHJhZWhnb3ltb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxOTYwMTEsImV4cCI6MjEwNTc3MjAxMX0.D5aN8qiGXVp4M_PsM_rlnt8o-HKJgt_4yMtxAUb44W8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const BUCKET_NAME = 'product-images';

/**
 * Uploads an image File to the Supabase storage bucket 'product-images'
 * and returns the public URL.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });

  if (uploadError) {
    console.error('Error uploading image to Supabase Storage:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la imagen cargada.');
  }

  return data.publicUrl;
}
