-- Enable RLS and define safe policies for portfolios table
-- This migration assumes portfolios.user_id is a TEXT/EMAIL field.
-- If you migrate user_id to UUID in the future, replace auth.jwt()->>'email' checks
-- with user_id::uuid = auth.uid().

begin;

-- 1) Enable RLS
alter table public.portfolios enable row level security;

-- 2) Public can only read published portfolios
drop policy if exists portfolios_public_read on public.portfolios;
create policy portfolios_public_read
on public.portfolios
as permissive
for select
to anon
using (is_published = true);

-- 3) Owner full CRUD (email-based)
-- Note: NextAuth kullanıyorsanız, Supabase client tarafında anon key ile çalışır.
-- Supabase Auth ile authenticated role oluşur; bu policy o durumda devreye girer.
-- Server tarafında service_role RLS'i bypass eder, bu normaldir.

drop policy if exists portfolios_owner_all on public.portfolios;
create policy portfolios_owner_all
on public.portfolios
as permissive
for all
to authenticated
using (
  user_id = coalesce(nullif(auth.jwt() ->> 'email', ''), '___nope___')
)
with check (
  user_id = coalesce(nullif(auth.jwt() ->> 'email', ''), '___nope___')
);

-- 4) (Optional) Allow read for authenticated users on their own rows explicitly
-- (covered by the ALL policy above, but sometimes helpful for clarity)
-- drop policy if exists portfolios_owner_read on public.portfolios;
-- create policy portfolios_owner_read
-- on public.portfolios
-- as permissive
-- for select
-- to authenticated
-- using (user_id = coalesce(nullif(auth.jwt() ->> 'email', ''), '___nope___'));

commit;
