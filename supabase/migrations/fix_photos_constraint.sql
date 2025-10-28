-- Alter the 'photos' column in the 'items' table
-- 1. Remove the NOT NULL constraint if it exists.
-- 2. Set a default value to an empty array.

ALTER TABLE public.items
ALTER COLUMN photos DROP NOT NULL,
ALTER COLUMN photos SET DEFAULT '{}'::text[];
