-- Create the user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'co_admin', 'estate_user')) NOT NULL DEFAULT 'estate_user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at timestamp on any row modification
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE PROCEDURE public.moddatetime();

-- RLS Policy 1: Users can manage their own profile
CREATE POLICY "Users can manage own profile"
ON public.user_profiles
FOR SELECT, UPDATE
USING (auth.uid() = id);

-- RLS Policy 2: Super Admins have full access to all profiles
CREATE POLICY "Super Admin full access"
ON public.user_profiles
FOR ALL
USING (EXISTS (
  SELECT 1
  FROM public.user_profiles up
  WHERE up.id = auth.uid()
  AND up.role = 'super_admin'
));
