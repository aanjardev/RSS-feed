-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json, file
  label VARCHAR(255),
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false, -- can be accessed by frontend without auth
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (key, value, type, label, description, category, is_public) VALUES
('site_name', 'Tilik Feed', 'string', 'Site Name', 'The name of your website', 'general', true),
('site_description', 'Aggregator RSS Feed Indonesia', 'string', 'Site Description', 'Brief description of your site', 'general', true),
('favicon_url', '/vite.svg', 'file', 'Favicon', 'Site favicon (ICO or PNG, 32x32 recommended)', 'appearance', true),
('logo_url', '', 'file', 'Logo URL', 'Site logo image URL', 'appearance', true),
('primary_color', '#3b82f6', 'string', 'Primary Color', 'Main brand color', 'appearance', true),
('items_per_page', '20', 'number', 'Items Per Page', 'Number of articles per page', 'content', false),
('enable_carousel', 'true', 'boolean', 'Enable Carousel', 'Show featured articles carousel', 'content', true),
('carousel_auto_play', 'true', 'boolean', 'Carousel Auto Play', 'Automatically cycle through carousel items', 'content', true),
('carousel_interval', '5000', 'number', 'Carousel Interval', 'Time between slides (milliseconds)', 'content', true),
('enable_sidebar', 'true', 'boolean', 'Enable Sidebar', 'Show sources sidebar', 'content', true),
('contact_email', '', 'string', 'Contact Email', 'Support email address', 'general', true),
('footer_text', '© 2026 Tilik Feed. All rights reserved.', 'string', 'Footer Text', 'Text displayed in footer', 'general', true)
ON CONFLICT (key) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_public ON settings(is_public);
