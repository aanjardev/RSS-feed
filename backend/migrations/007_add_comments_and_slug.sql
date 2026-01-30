-- Migration: Add comments table and slug to custom articles
-- Date: 2026-01-30

-- Add slug column to custom_articles
ALTER TABLE custom_articles 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Create comments table
CREATE TABLE IF NOT EXISTS article_comments (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES custom_articles(id) ON DELETE CASCADE,
  guest_name VARCHAR(100) NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  is_approved BOOLEAN DEFAULT true,
  CONSTRAINT fk_article FOREIGN KEY (article_id) REFERENCES custom_articles(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON article_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_articles_slug ON custom_articles(slug);

-- Generate slugs for existing articles
UPDATE custom_articles
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL;
