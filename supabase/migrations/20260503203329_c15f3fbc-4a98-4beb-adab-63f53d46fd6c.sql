
-- Ensure trigger exists on auth.users to call handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: promote any existing seeded emails to admin
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE u.email IN ('monirul.hasan513@gmail.com','mnsacademy32@gmail.com','munna.uk.bd@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin'
  );

-- Backfill: ensure profiles exist
INSERT INTO public.profiles (id, email)
SELECT u.id, u.email
FROM auth.users u
WHERE u.email IN ('monirul.hasan513@gmail.com','mnsacademy32@gmail.com','munna.uk.bd@gmail.com')
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);
