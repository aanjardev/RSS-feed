-- Migration: Add custom articles table
-- Created: 2026-01-29
-- This table stores manually created articles (not from RSS feeds)

CREATE TABLE IF NOT EXISTS custom_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,
  image_url VARCHAR(500),
  link VARCHAR(500),
  author VARCHAR(255),
  source_name VARCHAR(255) DEFAULT 'Editorial',
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  pub_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_custom_articles_published ON custom_articles(is_published);
CREATE INDEX idx_custom_articles_featured ON custom_articles(is_featured);
CREATE INDEX idx_custom_articles_category ON custom_articles(category_id);
CREATE INDEX idx_custom_articles_pub_date ON custom_articles(pub_date DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_custom_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_custom_articles_updated_at
  BEFORE UPDATE ON custom_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_custom_articles_updated_at();

-- Insert sample custom article
INSERT INTO custom_articles (title, description, content, source_name, is_published, is_featured)
VALUES (
  'Welcome to Custom Articles',
  'Create and manage your own articles without RSS feeds',
  '<p>This is a custom article feature that allows you to create, edit, and publish your own articles directly from the admin panel.</p><p>Articles can be featured, categorized, and displayed alongside RSS feed articles.</p>',
  'Editorial Team',
  true,
  false
);
