-- supabase/migrations/occupancy_tracking_schema.sql

alter table public.buildings
  add column occupied_by text,
  add column occupant_designation text,
  add column occupancy_start_date date;
