
-- Teachers
CREATE TABLE public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  expertise text NOT NULL,
  class_range text NOT NULL,
  photo_url text,
  display_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers public read" ON public.teachers FOR SELECT USING (is_visible = true OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage teachers" ON public.teachers FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Site settings (key/value)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  label text,
  is_visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value, label) VALUES
  ('platform_gmail','mnsacademy32@gmail.com','প্ল্যাটফর্ম জিমেইল'),
  ('whatsapp_number','01767340399','হোয়াটসঅ্যাপ নম্বর'),
  ('youtube_channel','https://www.youtube.com/@MNSAcademy-c5t','ইউটিউব চ্যানেল'),
  ('address','রুপনগর আবাসিক, রোড # ৬, বাসা #৬, মিরপুর ২','ঠিকানা');

-- Social links
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL UNIQUE,
  url text NOT NULL DEFAULT '',
  is_visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social public read" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins manage social" ON public.social_links FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.social_links (platform, url) VALUES
  ('facebook_page','https://facebook.com/'),
  ('facebook_group','https://facebook.com/groups/'),
  ('youtube','https://www.youtube.com/@MNSAcademy-c5t'),
  ('instagram','https://instagram.com/');

-- Class / free class links
CREATE TABLE public.class_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  type text NOT NULL DEFAULT 'free',
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.class_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Class links public read" ON public.class_links FOR SELECT USING (is_visible = true OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage class links" ON public.class_links FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Exam links
CREATE TABLE public.exam_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  publish_date timestamptz NOT NULL DEFAULT now(),
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exam public read" ON public.exam_links FOR SELECT USING (is_visible = true OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage exams" ON public.exam_links FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Contact messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone send message" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read messages" ON public.messages FOR SELECT USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage messages" ON public.messages FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Add is_visible to existing tables
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;

-- Update Courses public read to include visibility
DROP POLICY IF EXISTS "Courses public read" ON public.courses;
CREATE POLICY "Courses public read" ON public.courses FOR SELECT USING ((is_published = true AND is_visible = true) OR has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Notices public read" ON public.notices;
CREATE POLICY "Notices public read" ON public.notices FOR SELECT USING (is_visible = true OR has_role(auth.uid(),'admin'));

-- Seed teachers
INSERT INTO public.teachers (name, expertise, class_range, display_order) VALUES
  ('MAHMUDUL HASAN MUNNA','Expert in English, Bangla','Class 1 to 12',1),
  ('ALTAFUR RAHMAN NILOY','Expert in Math, Physics, Chemistry','Class 1 to 12',2);

-- Auto-promote MNS Academy admins on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'), NEW.email);
  IF NEW.email IN ('monirul.hasan513@gmail.com','mnsacademy32@gmail.com','munna.uk.bd@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  END IF;
  RETURN NEW;
END;
$$;

-- Promote any of the three admin emails that already exist
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email IN ('monirul.hasan513@gmail.com','mnsacademy32@gmail.com','munna.uk.bd@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
