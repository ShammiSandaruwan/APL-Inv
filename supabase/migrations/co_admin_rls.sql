-- supabase/migrations/co_admin_rls.sql

-- Step 1: Create a helper function to check if a user has access to a specific estate.
create or replace function has_estate_access(estate_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_estate_access
    where user_id = auth.uid() and user_estate_access.estate_id = $1
  )
$$;

-- Step 2: Create a helper function to check a user's specific permission.
create or replace function get_co_admin_permission(permission_name text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    case
      when permission_name = 'can_create_items' then can_create_items
      when permission_name = 'can_edit_items' then can_edit_items
      when permission_name = 'can_delete_items' then can_delete_items
      when permission_name = 'can_manage_estates' then can_manage_estates
      when permission_name = 'can_manage_buildings' then can_manage_buildings
      when permission_name = 'can_manage_categories' then can_manage_categories
      when permission_name = 'can_generate_reports' then can_generate_reports
      when permission_name = 'can_view_audit_logs' then can_view_audit_logs
      else false
    end
  from public.co_admin_permissions
  where user_id = auth.uid()
$$;

-- Step 3: Define RLS policies for the 'estates' table.
alter table public.estates enable row level security;
drop policy if exists "Allow full access to super admins" on public.estates;
create policy "Allow full access to super admins" on public.estates for all
  using (get_my_role() = 'super_admin');
drop policy if exists "Allow read access to co-admins" on public.estates;
create policy "Allow read access to co-admins" on public.estates for select
  using (get_my_role() = 'co_admin' and has_estate_access(id));
drop policy if exists "Allow limited write access to co-admins" on public.estates;
create policy "Allow limited write access to co-admins" on public.estates for all
  using (get_my_role() = 'co_admin' and has_estate_access(id) and get_co_admin_permission('can_manage_estates'));

-- Step 4: Define RLS policies for the 'buildings' table.
alter table public.buildings enable row level security;
drop policy if exists "Allow full access to super admins" on public.buildings;
create policy "Allow full access to super admins" on public.buildings for all
  using (get_my_role() = 'super_admin');
drop policy if exists "Allow read access to co-admins" on public.buildings;
create policy "Allow read access to co-admins" on public.buildings for select
  using (get_my_role() = 'co_admin' and has_estate_access(estate_id));
drop policy if exists "Allow limited write access to co-admins" on public.buildings;
create policy "Allow limited write access to co-admins" on public.buildings for all
  using (get_my_role() = 'co_admin' and has_estate_access(estate_id) and get_co_admin_permission('can_manage_buildings'));

-- Step 5: Define RLS policies for the 'items' table.
alter table public.items enable row level security;
drop policy if exists "Allow full access to super admins" on public.items;
create policy "Allow full access to super admins" on public.items for all
  using (get_my_role() = 'super_admin');
drop policy if exists "Allow read access to co-admins" on public.items;
create policy "Allow read access to co-admins" on public.items for select
  using (get_my_role() = 'co_admin' and has_estate_access(estate_id));
drop policy if exists "Allow create access to co-admins" on public.items;
create policy "Allow create access to co-admins" on public.items for insert
  with check (get_my_role() = 'co_admin' and has_estate_access(estate_id) and get_co_admin_permission('can_create_items'));
drop policy if exists "Allow update access to co-admins" on public.items;
create policy "Allow update access to co-admins" on public.items for update
  using (get_my_role() = 'co_admin' and has_estate_access(estate_id) and get_co_admin_permission('can_edit_items'));
drop policy if exists "Allow delete access to co-admins" on public.items;
create policy "Allow delete access to co-admins" on public.items for delete
  using (get_my_role() = 'co_admin' and has_estate_access(estate_id) and get_co_admin_permission('can_delete_items'));
