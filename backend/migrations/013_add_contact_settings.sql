-- Migration 013: Add contact information settings for About page
-- These settings allow editing contact details from dashboard

-- Add contact email setting (if not exists from previous migration)
INSERT INTO settings (key, value, type, label, description, category, is_public) 
VALUES (
  'contact_phone', 
  '+62 812-3456-7890', 
  'string', 
  'Contact Phone', 
  'WhatsApp or phone number for contact', 
  'general', 
  true
)
ON CONFLICT (key) DO UPDATE 
SET 
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public;

-- Add contact location setting
INSERT INTO settings (key, value, type, label, description, category, is_public) 
VALUES (
  'contact_location', 
  'Jayapura, Papua', 
  'string', 
  'Contact Location', 
  'Office or business location', 
  'general', 
  true
)
ON CONFLICT (key) DO UPDATE 
SET 
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public;
