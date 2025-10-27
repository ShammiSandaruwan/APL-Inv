-- supabase/migrations/fix_rls_policy.sql

-- Step 1: Create a security definer function to get the user's role without recursion.
-- This function runs with the privileges of the user who created it (the superuser),
-- bypassing the RLS policy on the user_profiles table when called.
create or replace function get_my_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.user_profiles where id = auth.uid()
$$;

-- Step 2: Drop the old, recursive policy.
-- The name matches the one created in the previous mvp_schema.sql script.
drop policy "Allow admin access to user profiles" on public.user_profiles;

-- Step 3: Create the new, non-recursive policy.
-- This policy allows users to see all profiles only if their role is 'super_admin'.
create policy "Allow super_admin access to user profiles"
on public.user_profiles for select
using (get_my_role() = 'super_admin');
