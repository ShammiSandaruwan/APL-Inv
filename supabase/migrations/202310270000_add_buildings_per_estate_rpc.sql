-- supabase/migrations/202310270000_add_buildings_per_estate_rpc.sql
CREATE OR REPLACE FUNCTION get_buildings_per_estate()
RETURNS TABLE (
  name TEXT,
  building_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.name,
    count(b.id) as building_count
  FROM estates e
  LEFT JOIN buildings b ON e.id = b.estate_id
  GROUP BY e.name;
END;
$$ LANGUAGE plpgsql;
