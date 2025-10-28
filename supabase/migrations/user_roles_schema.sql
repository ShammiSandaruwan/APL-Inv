-- This script adds user roles and profiles to the database.

-- 1. Create a 'user_profiles' table to store public user data.
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT
);

-- 2. Create a function to automatically create a profile when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a trigger to call the function when a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Enable RLS on the new 'user_profiles' table.
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for 'user_profiles' table.
-- Allow users to see their own profile.
CREATE POLICY "Allow individual read access"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

-- Allow admins to see all profiles.
CREATE POLICY "Allow admin read access"
ON public.user_profiles FOR SELECT
USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
);
