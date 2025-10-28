-- This script adds a 'photos' column to the 'items' table.
-- This column will store an array of URLs for the item's images.

ALTER TABLE public.items
ADD COLUMN photos TEXT[];
