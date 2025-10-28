-- This script makes the 'item-photos' bucket public.
-- This is necessary for the images to be viewable in the application.

-- 1. Update the bucket to be public.
UPDATE storage.buckets
SET public = true
WHERE id = 'item-photos';

-- 2. Create a new policy to allow public read access.
CREATE POLICY "Public read access for item photos"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'item-photos' );
