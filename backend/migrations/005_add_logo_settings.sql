-- Migration: Add logo size settings
-- Created: 2026-01-29

-- Add logo height setting
INSERT INTO settings (key, value, label, description, type, category, is_public, created_at, updated_at)
VALUES 
  ('logo_height', '48', 'Logo Height', 'Logo height in pixels (default: 48px)', 'number', 'appearance', true, NOW(), NOW()),
  ('logo_width', 'auto', 'Logo Width', 'Logo width (default: auto)', 'text', 'appearance', true, NOW(), NOW())
ON CONFLICT (key) DO NOTHING;
