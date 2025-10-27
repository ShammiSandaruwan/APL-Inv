-- supabase/migrations/add_test_data.sql

INSERT INTO public.estates (name, code, location) VALUES ('Estate Alpha', 'EA', 'Colombo');
INSERT INTO public.buildings (name, code, estate_id, building_type) VALUES ('Building A', 'BA', 1, 'Office');
