-- Migration 010: Add KONTRIBUTOR role and author tracking for custom articles
-- Add author column to custom_articles to track who created each article
ALTER TABLE custom_articles 
ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Create index on author_id for faster queries
CREATE INDEX IF NOT EXISTS idx_custom_articles_author ON custom_articles(author_id);

-- Update role enum to include KONTRIBUTOR (if using enum) or just document valid roles
-- Valid roles: 'admin', 'kontributor'
-- Note: We're removing 'editor' and using 'kontributor' instead

-- Update any existing 'editor' role to 'kontributor'
UPDATE users 
SET role = 'kontributor' 
WHERE role = 'editor' OR role = 'EDITOR';
