-- Migration 011: Add articles_per_source setting
-- This setting controls how many articles are loaded per source card (not slider)
-- items_per_page (setting #6) controls slider items

-- Add new setting for articles per source
INSERT INTO settings (key, value, type, label, description, category, is_public) 
VALUES (
  'articles_per_source', 
  '10', 
  'number', 
  'Articles Per Source', 
  'Number of articles to display per source card', 
  'content', 
  false
)
ON CONFLICT (key) DO UPDATE 
SET 
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public;

-- Update items_per_page description to clarify it's for slider
UPDATE settings 
SET description = 'Number of articles in slider/carousel'
WHERE key = 'items_per_page';
