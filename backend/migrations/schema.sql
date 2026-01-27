-- RSS Feed Sources Table
CREATE TABLE IF NOT EXISTS rss_sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RSS Articles Table
CREATE TABLE IF NOT EXISTS rss_articles (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES rss_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  description TEXT,
  pub_date TIMESTAMP,
  content TEXT,
  image_url TEXT,
  author VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON rss_articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_pub_date ON rss_articles(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_sources_active ON rss_sources(is_active);

-- Insert some default RSS sources
INSERT INTO rss_sources (name, url, category) VALUES
  ('TechCrunch', 'https://techcrunch.com/feed/', 'Technology'),
  ('Hacker News', 'https://news.ycombinator.com/rss', 'Technology'),
  ('BBC News', 'http://feeds.bbci.co.uk/news/rss.xml', 'News'),
  ('The Verge', 'https://www.theverge.com/rss/index.xml', 'Technology'),
  ('Wired', 'https://www.wired.com/feed/rss', 'Technology')
ON CONFLICT (url) DO NOTHING;
