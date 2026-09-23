export const SUPABASE_SETUP_SQL = `-- ==============================================================================
-- VELVET BLOOM: Script SQL para inicialización de Base de Datos y Almacenamiento
-- Ejecuta este script en el Editor SQL de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/eaortvuyhraehgoymohh/sql
-- ==============================================================================

-- 1. Crear extensión para UUID (por si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Crear tabla de productos con los campos requeridos y complementarios
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  category TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  sku TEXT,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  colors JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar que las columnas existan en caso de que la tabla ya haya sido creada previamente
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='image_url') THEN
    ALTER TABLE public.products ADD COLUMN image_url TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sku') THEN
    ALTER TABLE public.products ADD COLUMN sku TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='available') THEN
    ALTER TABLE public.products ADD COLUMN available BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='featured') THEN
    ALTER TABLE public.products ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='colors') THEN
    ALTER TABLE public.products ADD COLUMN colors JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sizes') THEN
    ALTER TABLE public.products ADD COLUMN sizes JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='features') THEN
    ALTER TABLE public.products ADD COLUMN features JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='images') THEN
    ALTER TABLE public.products ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='updated_at') THEN
    ALTER TABLE public.products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- 3. Habilitar Seguridad por Filas (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas permisivas para lectura y operaciones CRUD
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON public.products;
CREATE POLICY "Permitir lectura pública de productos"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir inserción de productos" ON public.products;
CREATE POLICY "Permitir inserción de productos"
  ON public.products FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualización de productos" ON public.products;
CREATE POLICY "Permitir actualización de productos"
  ON public.products FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir eliminación de productos" ON public.products;
CREATE POLICY "Permitir eliminación de productos"
  ON public.products FOR DELETE
  USING (true);

-- 5. Habilitar publicación en tiempo real (Realtime)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;

-- 6. Crear el Bucket de Storage público para imágenes 'product-images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. Políticas de Storage para acceso público y subida
DROP POLICY IF EXISTS "Acceso público lectura imágenes productos" ON storage.objects;
CREATE POLICY "Acceso público lectura imágenes productos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Permitir subida de imágenes productos" ON storage.objects;
CREATE POLICY "Permitir subida de imágenes productos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Permitir actualización imágenes productos" ON storage.objects;
CREATE POLICY "Permitir actualización imágenes productos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Permitir eliminación imágenes productos" ON storage.objects;
CREATE POLICY "Permitir eliminación imágenes productos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
`;
