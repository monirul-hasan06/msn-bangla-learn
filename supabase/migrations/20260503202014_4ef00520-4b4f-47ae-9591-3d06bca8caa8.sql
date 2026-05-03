-- Add image columns to tables that need them
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.exam_links ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.class_links ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Seed hero_banner_url setting if not exists
INSERT INTO public.site_settings (key, value, label, is_visible)
VALUES ('hero_banner_url', '', 'Hero Banner Image URL', true)
ON CONFLICT DO NOTHING;

-- Create public media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage.objects on media bucket
CREATE POLICY "Media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Admins upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));