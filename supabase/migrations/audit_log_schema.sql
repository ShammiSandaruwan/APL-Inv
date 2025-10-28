-- This script sets up the audit trail feature.

-- 1. Create the 'audit_logs' table.
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB
);

-- 2. Create a function to record audit log entries.
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS TRIGGER AS $$
DECLARE
  user_id_value UUID;
BEGIN
  SELECT auth.uid() INTO user_id_value;

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (user_id, action, entity, entity_id, new_data)
    VALUES (user_id_value, 'CREATE', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_logs (user_id, action, entity, entity_id, old_data, new_data)
    VALUES (user_id_value, 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (user_id, action, entity, entity_id, old_data)
    VALUES (user_id_value, 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create triggers for each table to be audited.
CREATE TRIGGER audit_estates_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.estates
FOR EACH ROW EXECUTE PROCEDURE public.log_audit();

CREATE TRIGGER audit_buildings_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.buildings
FOR EACH ROW EXECUTE PROCEDURE public.log_audit();

CREATE TRIGGER audit_items_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.items
FOR EACH ROW EXECUTE PROCEDURE public.log_audit();
