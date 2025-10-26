-- This script sets up the Supabase Storage for the project.

-- 1. Create the storage bucket for item photos.
-- The INSERT statement creates the bucket if it doesn't exist.
-- The ON CONFLICT clause prevents errors if you run the script again.
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Create security policies for the 'item-photos' bucket.
-- These policies grant full access (select, insert, update, delete)
-- to any user who is logged in (authenticated). This is perfect for our MVP,
-- where we will only have the Super Admin role.

-- Policy: Allow authenticated users to VIEW photos.
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'item-photos' );

-- Policy: Allow authenticated users to UPLOAD new photos.
CREATE POLICY "Allow authenticated inserts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'item-photos' );

-- Policy: Allow authenticated users to UPDATE existing photos.
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'item-photos' );

-- Policy: Allow authenticated users to DELETE photos.
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'item-photos' );
