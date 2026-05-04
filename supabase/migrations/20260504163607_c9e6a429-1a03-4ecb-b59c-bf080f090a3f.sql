
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspended_until timestamptz;

ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS course_id uuid;
ALTER TABLE public.class_links ADD COLUMN IF NOT EXISTS course_id uuid;
ALTER TABLE public.exam_links ADD COLUMN IF NOT EXISTS course_id uuid;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS course_id uuid;

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reply text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS replied_at timestamptz;

CREATE OR REPLACE FUNCTION public.is_enrolled(_course_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = _course_id AND user_id = auth.uid() AND status = 'approved'
  );
$$;

-- Replace public read policies to honor course targeting
DROP POLICY IF EXISTS "Notices public read" ON public.notices;
CREATE POLICY "Notices read" ON public.notices FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (is_visible = true AND (course_id IS NULL OR public.is_enrolled(course_id)))
);

DROP POLICY IF EXISTS "Class links public read" ON public.class_links;
CREATE POLICY "Class links read" ON public.class_links FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (is_visible = true AND (course_id IS NULL OR public.is_enrolled(course_id)))
);

DROP POLICY IF EXISTS "Exam public read" ON public.exam_links;
CREATE POLICY "Exam read" ON public.exam_links FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (is_visible = true AND (course_id IS NULL OR public.is_enrolled(course_id)))
);

-- Notifications: owner sees own, broadcast (no user/course) public, course notifications visible to enrolled
DROP POLICY IF EXISTS "Notifications visible to owner or broadcast" ON public.notifications;
CREATE POLICY "Notifications read" ON public.notifications FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (user_id IS NULL AND course_id IS NULL)
  OR (user_id = auth.uid())
  OR (course_id IS NOT NULL AND public.is_enrolled(course_id))
);
