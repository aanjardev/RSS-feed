-- Migration: Add comments table and slug to custom articles
-- Date: 2026-01-30

-- Add slug column to custom_articles (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='custom_articles' AND column_name='slug'
  ) THEN
    ALTER TABLE custom_articles ADD COLUMN slug VARCHAR(255);
  END IF;
END $$;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_articles_slug_unique ON custom_articles(slug);

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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON article_comments(created_at DESC);
