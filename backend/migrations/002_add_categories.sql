-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('News', 'news', 'General news articles', '📰', '#3b82f6'),
('Business', 'business', 'Business and economy news', '💼', '#10b981'),
('Technology', 'technology', 'Tech and innovation news', '💻', '#8b5cf6'),
('Sports', 'sports', 'Sports and athletics news', '⚽', '#f59e0b'),
('Entertainment', 'entertainment', 'Entertainment and lifestyle', '🎬', '#ec4899')
ON CONFLICT (slug) DO NOTHING;

-- Add foreign key to rss_sources if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'rss_sources_category_id_fkey'
  ) THEN
    -- Add category_id column if not exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'rss_sources' AND column_name = 'category_id'
    ) THEN
      ALTER TABLE rss_sources ADD COLUMN category_id INTEGER;
    END IF;
    
    -- Update existing sources to match categories
    UPDATE rss_sources SET category_id = (SELECT id FROM categories WHERE slug = 'news') WHERE category = 'News' OR category IS NULL;
    UPDATE rss_sources SET category_id = (SELECT id FROM categories WHERE slug = 'business') WHERE category = 'Business';
    UPDATE rss_sources SET category_id = (SELECT id FROM categories WHERE slug = 'technology') WHERE category = 'Technology';
    UPDATE rss_sources SET category_id = (SELECT id FROM categories WHERE slug = 'sports') WHERE category = 'Sports';
    UPDATE rss_sources SET category_id = (SELECT id FROM categories WHERE slug = 'entertainment') WHERE category = 'Entertainment';
    
    -- Add foreign key constraint
    ALTER TABLE rss_sources ADD CONSTRAINT rss_sources_category_id_fkey 
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;
