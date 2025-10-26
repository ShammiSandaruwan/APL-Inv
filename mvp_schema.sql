--
-- Create the 'estates' table
--
CREATE TABLE IF NOT EXISTS public.estates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    location VARCHAR(255),
    address TEXT,
    total_area NUMERIC,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Add comments to 'estates' table columns
COMMENT ON TABLE public.estates IS 'Stores information about each estate.';
COMMENT ON COLUMN public.estates.id IS 'Unique identifier for the estate.';
COMMENT ON COLUMN public.estates.created_at IS 'Timestamp when the estate was created.';
COMMENT ON COLUMN public.estates.name IS 'The name of the estate (e.g., "Estate Alpha").';
COMMENT ON COLUMN public.estates.code IS 'A unique code for the estate (e.g., "EST001").';
COMMENT ON COLUMN public.estates.location IS 'The city or general location of the estate.';
COMMENT ON COLUMN public.estates.address IS 'The complete address of the estate.';
COMMENT ON COLUMN public.estates.total_area IS 'The total area of the estate (optional).';
COMMENT ON COLUMN public.estates.description IS 'A description of the estate.';
COMMENT ON COLUMN public.estates.is_active IS 'Whether the estate is currently active or inactive.';
COMMENT ON COLUMN public.estates.created_by IS 'The user who created the estate record.';


--
-- Create the 'buildings' table
--
CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    estate_id UUID REFERENCES public.estates(id) ON DELETE CASCADE NOT NULL,
    building_type VARCHAR(100) CHECK (building_type IN ('Factory', 'Bungalow', 'Staff Quarters', 'Warehouse', 'Office', 'Other')),
    num_floors INTEGER,
    total_area NUMERIC,
    construction_year INTEGER,
    occupied_by VARCHAR(255),
    occupant_designation VARCHAR(255),
    occupancy_start_date DATE,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    UNIQUE (estate_id, code) -- Building code must be unique within an estate
);

-- Add comments to 'buildings' table columns
COMMENT ON TABLE public.buildings IS 'Stores information about buildings within each estate.';
COMMENT ON COLUMN public.buildings.id IS 'Unique identifier for the building.';
COMMENT ON COLUMN public.buildings.code IS 'Unique code for the building within its estate (e.g., "BLD001").';
COMMENT ON COLUMN public.buildings.estate_id IS 'Foreign key referencing the estate this building belongs to.';
COMMENT ON COLUMN public.buildings.building_type IS 'The type of the building.';
COMMENT ON COLUMN public.buildings.occupied_by IS 'The name of the person or organization currently occupying the building.';


--
-- Create the 'categories' table for items
--
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    icon VARCHAR(100)
);

COMMENT ON TABLE public.categories IS 'Stores item categories in a hierarchical structure.';
COMMENT ON COLUMN public.categories.parent_id IS 'References the parent category for creating a hierarchy.';


--
-- Create the 'items' table
--
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    item_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    estate_id UUID REFERENCES public.estates(id) ON DELETE CASCADE NOT NULL,
    building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE NOT NULL,
    room_location VARCHAR(255),
    quantity INTEGER DEFAULT 1 NOT NULL,
    unit_of_measurement VARCHAR(50) DEFAULT 'units',
    condition VARCHAR(50) CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Poor', 'Damaged')),
    status VARCHAR(50) CHECK (status IN ('Active', 'In Repair', 'Retired', 'Disposed')),
    purchase_date DATE,
    purchase_price NUMERIC(10, 2),
    warranty_expiry_date DATE,
    supplier_name VARCHAR(255),
    brand VARCHAR(100),
    model_number VARCHAR(100),
    serial_number VARCHAR(255) UNIQUE,
    dimensions_length NUMERIC,
    dimensions_width NUMERIC,
    dimensions_height NUMERIC,
    dimensions_unit VARCHAR(20),
    weight NUMERIC,
    color VARCHAR(50),
    material VARCHAR(100),
    notes TEXT
);

COMMENT ON TABLE public.items IS 'Stores information about each individual asset/item.';
COMMENT ON COLUMN public.items.item_code IS 'Auto-generated unique code for the item.';
COMMENT ON COLUMN public.items.estate_id IS 'Foreign key referencing the estate this item belongs to.';
COMMENT ON COLUMN public.items.building_id IS 'Foreign key referencing the building this item is located in.';


--
-- Enable Row Level Security (RLS) on the tables
--
ALTER TABLE public.estates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

--
-- For the MVP, since only the Super Admin will be using the system,
-- we can create a simple policy that allows full access to authenticated users.
-- We will refine this later when we add Co-Admin and Estate User roles.
-- For now, this allows any logged-in user to do anything, which is fine for the Super Admin MVP.
--
CREATE POLICY "Allow full access to authenticated users"
ON public.estates
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users"
ON public.buildings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users"
ON public.categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users"
ON public.items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
