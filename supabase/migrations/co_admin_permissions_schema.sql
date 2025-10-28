-- supabase/migrations/co_admin_permissions_schema.sql

-- Step 1: Create a user_role enum type for better data integrity.
create type public.user_role as enum ('super_admin', 'co_admin', 'estate_user');

-- Step 2: Alter the user_profiles table to use the new enum type.
-- This also sets a default value for new users.
alter table public.user_profiles
  alter column role type public.user_role using role::public.user_role,
  alter column role set default 'estate_user';

-- Step 3: Create the user_estate_access table.
-- This table creates a many-to-many relationship between users and estates,
-- allowing us to control which estates a Co-Admin or Estate User can access.
create table public.user_estate_access (
  user_id uuid not null references auth.users(id) on delete cascade,
  estate_id uuid not null references public.estates(id) on delete cascade,
  primary key (user_id, estate_id)
);

-- Enable RLS for the new table.
alter table public.user_estate_access enable row level security;

-- Step 4: Create the co_admin_permissions table.
-- This table stores the granular, boolean permissions for each Co-Admin.
create table public.co_admin_permissions (
  user_id uuid not null primary key references auth.users(id) on delete cascade,
  can_create_items boolean not null default false,
  can_edit_items boolean not null default false,
  can_delete_items boolean not null default false,
  can_manage_estates boolean not null default false,
  can_manage_buildings boolean not null default false,
  can_manage_categories boolean not null default false,
  can_generate_reports boolean not null default false,
  can_view_audit_logs boolean not null default false
);

-- Enable RLS for the new table.
alter table public.co_admin_permissions enable row level security;

-- Step 5: Define RLS policies for the new tables.
-- Super Admins can see and do everything.
create policy "Allow super_admin full access to user_estate_access"
on public.user_estate_access for all
using (get_my_role() = 'super_admin');

create policy "Allow super_admin full access to co_admin_permissions"
on public.co_admin_permissions for all
using (get_my_role() = 'super_admin');

-- Co-Admins should be able to see their own permissions.
create policy "Allow co_admin to see their own permissions"
on public.co_admin_permissions for select
using (auth.uid() = user_id);

-- Co-Admins should be able to see their own estate access records.
create policy "Allow co_admin to see their own estate access"
on public.user_estate_access for select
using (auth.uid() = user_id);
