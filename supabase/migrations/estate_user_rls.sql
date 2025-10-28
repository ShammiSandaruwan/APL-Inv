-- supabase/migrations/estate_user_rls.sql

-- Step 1: Define RLS policies for the 'estates' table.
drop policy if exists "Allow read access to estate users" on public.estates;
create policy "Allow read access to estate users" on public.estates for select
  using (get_my_role() = 'estate_user' and has_estate_access(id));

-- Step 2: Define RLS policies for the 'buildings' table.
drop policy if exists "Allow read access to estate users" on public.buildings;
create policy "Allow read access to estate users" on public.buildings for select
  using (get_my_role() = 'estate_user' and has_estate_access(estate_id));

-- Step 3: Define RLS policies for the 'items' table.
drop policy if exists "Allow read access to estate users" on public.items;
create policy "Allow read access to estate users" on public.items for select
  using (get_my_role() = 'estate_user' and has_estate_access(estate_id));
drop policy if exists "Allow write access to estate users" on public.items;
create policy "Allow write access to estate users" on public.items for all
  using (get_my_role() = 'estate_user' and has_estate_access(estate_id));
