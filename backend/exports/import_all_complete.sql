-- ============================================
-- Complete Database Setup for RSS Feed
-- Import Order: Migrations -> Data
-- ============================================

-- Migration 001: Initial Schema (rss_sources, rss_articles)
CREATE TABLE IF NOT EXISTS rss_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL UNIQUE,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logo TEXT,
    description TEXT,
    category_id INTEGER
);

CREATE TABLE IF NOT EXISTS rss_articles (
    id SERIAL PRIMARY KEY,
    source_id INTEGER REFERENCES rss_sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    pub_date TIMESTAMP,
    description TEXT,
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_articles_source ON rss_articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_pub_date ON rss_articles(pub_date);

-- Migration 002: Categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'rss_sources_category_id_fkey'
    ) THEN
        ALTER TABLE rss_sources 
        ADD CONSTRAINT rss_sources_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Migration 003: Settings
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string',
    label VARCHAR(255),
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_public ON settings(is_public);

-- ============================================
-- Data Import
-- ============================================

-- Insert Categories (15 total)
INSERT INTO categories (id, name, slug, description, icon, color, is_active, created_at, updated_at) VALUES 
(1, 'News', 'news', 'General news and current events', '📰', '#3b82f6', true, NOW(), NOW()),
(2, 'Business', 'business', 'Business and economic news', '💼', '#10b981', true, NOW(), NOW()),
(3, 'Technology', 'technology', 'Tech news and innovation', '💻', '#8b5cf6', true, NOW(), NOW()),
(4, 'Sports', 'sports', 'Sports news and updates', '⚽', '#f59e0b', true, NOW(), NOW()),
(5, 'Entertainment', 'entertainment', 'Entertainment and lifestyle', '🎬', '#ec4899', true, NOW(), NOW()),
(11, 'Lokal', 'lokal', 'Berita lokal daerah', '🏘️', '#06b6d4', true, NOW(), NOW()),
(12, 'Nasional', 'nasional', 'Berita nasional Indonesia', '🇮🇩', '#ef4444', true, NOW(), NOW()),
(13, 'Internasional', 'internasional', 'Berita internasional dunia', '🌍', '#8b5cf6', true, NOW(), NOW()),
(14, 'Olahraga', 'olahraga', 'Berita olahraga', '⚽', '#f59e0b', true, NOW(), NOW()),
(15, 'Hukum', 'hukum', 'Berita hukum dan kriminal', '⚖️', '#64748b', true, NOW(), NOW()),
(16, 'Politik', 'politik', 'Berita politik dan pemerintahan', '🏛️', '#7c3aed', true, NOW(), NOW()),
(17, 'Otonomi Khusus', 'otonomi-khusus', 'Berita terkait otonomi khusus', '🏞️', '#84cc16', true, NOW(), NOW()),
(18, 'Kesehatan', 'kesehatan', 'Berita kesehatan', '🏥', '#10b981', true, NOW(), NOW()),
(19, 'Opini', 'opini', 'Artikel opini dan kolom', '💭', '#f97316', true, NOW(), NOW()),
(20, 'Artikel', 'artikel', 'Artikel mendalam', '📝', '#06b6d4', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Settings (12 default)
INSERT INTO settings (id, key, value, type, label, description, category, is_public) VALUES
(1, 'site_name', 'Tilik Feed', 'string', 'Site Name', 'The name of your website', 'general', true),
(2, 'site_description', 'Aggregator RSS Feed Indonesia', 'string', 'Site Description', 'Brief description of your site', 'general', true),
(3, 'favicon_url', '/vite.svg', 'file', 'Favicon URL', 'Path to your favicon image', 'appearance', true),
(4, 'logo_url', '', 'file', 'Logo URL', 'Path to your site logo', 'appearance', true),
(5, 'primary_color', '#3b82f6', 'string', 'Primary Color', 'Main brand color (hex)', 'appearance', true),
(6, 'items_per_page', '20', 'number', 'Items Per Page', 'Number of articles per page', 'content', false),
(7, 'enable_carousel', 'true', 'boolean', 'Enable Carousel', 'Show featured news carousel', 'content', true),
(8, 'carousel_auto_play', 'true', 'boolean', 'Carousel Auto Play', 'Auto-advance carousel slides', 'content', true),
(9, 'carousel_interval', '5000', 'number', 'Carousel Interval', 'Slide interval in milliseconds', 'content', true),
(10, 'enable_sidebar', 'true', 'boolean', 'Enable Sidebar', 'Show sidebar navigation', 'content', true),
(11, 'contact_email', '', 'string', 'Contact Email', 'Support email address', 'general', true),
(12, 'footer_text', '© 2026 Tilik Feed. All rights reserved.', 'string', 'Footer Text', 'Copyright text in footer', 'general', true)
ON CONFLICT (id) DO NOTHING;

-- Insert RSS Sources (26 sources)
INSERT INTO rss_sources (id, name, url, category, is_active, created_at, updated_at, logo, description, category_id) VALUES 
(27, 'CNN Ekonomi', 'https://www.cnnindonesia.com/ekonomi/rss', 'Business', false, NOW(), NOW(), '/assets/logos/cnn-ekonomi.png', 'CNN Indonesia | Berita Terkini Ekonomi', 2),
(19, 'Detik News', 'https://news.detik.com/berita/rss', 'News', false, NOW(), NOW(), '/assets/logos/detik-news.png', 'Berita - Detikcom', 1),
(12, 'Liputan 6', 'https://feed.liputan6.com/rss/news', 'News', false, NOW(), NOW(), '/assets/logos/liputan-6.jpeg', 'Liputan6.com Politik', 1),
(20, 'Detik Finance', 'https://finance.detik.com/rss', 'Business', false, NOW(), NOW(), '/assets/logos/detik-finance.png', 'Finance - Detikcom', 2),
(17, 'Okezone', 'https://sindikasi.okezone.com/index.php/rss/0/RSS2.0', 'Business', false, NOW(), NOW(), '/assets/logos/okezone.png', 'Sindikasi economy.okezone.com', 2),
(22, 'Kumparan', 'https://lapi.kumparan.com/v2.0/rss/', 'News', false, NOW(), NOW(), '/assets/logos/kumparan.png', 'kumparan - #kumparanAdalahJawaban', 1),
(11, 'Tempo Bisnis', 'https://rss.tempo.co/bisnis', 'Business', false, NOW(), NOW(), '/assets/logos/tempo-bisnis.png', 'Tempo.co Berita Bisnis Terkini Indonesia dan Dunia RSS', 2),
(14, 'CNBC Market', 'https://www.cnbcindonesia.com/market/rss/', 'Business', false, NOW(), NOW(), '/assets/logos/cnbc-market.png', 'Market - Berita Terkini Market, Saham, Reksadana - CNBC Indonesia', 2),
(29, 'Tribunnews Papua', 'https://papua.tribunnews.com/rss', 'News', true, NOW(), NOW(), 'https://rss.fekusadev.com/assets/logos/tribunnews.png', '', NULL),
(30, 'iNews Papua', 'https://papua.inews.id/feed', 'News', true, NOW(), NOW(), 'https://static.inews.co.id/img/iNews@2x.png', NULL, NULL),
(28, 'Antara', 'https://www.antaranews.com/rss/top-news', 'News', false, NOW(), NOW(), '/assets/logos/antara.png', 'Berita Top News - ANTARA News', 1),
(31, 'iNews Jayapura', 'https://jayapura.inews.id/rss', 'News', true, NOW(), NOW(), 'https://static.inews.co.id/img/iNews@2x.png', NULL, NULL),
(32, 'Jubi', 'https://jubi.id/feed/', 'News', true, NOW(), NOW(), 'https://jubi.id/wp-content/uploads/2024/08/logo-24-PTjubi1.png', 'Jujur Bicara', NULL),
(33, 'Antaranews Papua', 'https://papua.antaranews.com/rss/terkini.xml', 'News', true, NOW(), NOW(), 'https://papua.antaranews.com/img/www.antarapapua.com.png', 'Berita Papua', NULL),
(16, 'Republika', 'https://www.republika.co.id/rss', 'News', false, NOW(), NOW(), '/assets/logos/republika.png', 'Republika Online RSS Feed', 1),
(24, 'SindoNews', 'https://www.sindonews.com/feed', 'News', false, NOW(), NOW(), '/assets/logos/sindonews.png', 'Berita Terkini dan Informasi Terbaru Hari Ini - SINDOnews', 1),
(34, 'Papua Pos', 'https://www.papuapos.com/feed/', 'News', true, NOW(), NOW(), 'https://www.papuapos.com/wp-content/uploads/2020/10/djoe-logo-papua-pos-1.png', 'Berita & Opini', NULL),
(23, 'Suara Pembaharuan', 'https://www.suarapembaharuan.com/feeds/posts/default', 'News', false, NOW(), NOW(), '/assets/logos/suara-pembaharuan.png', 'Suara Pembaharuan', 1),
(21, 'Viva', 'https://www.viva.co.id/get/all', 'News', false, NOW(), NOW(), '/assets/logos/viva.png', 'VIVA - Berita Harian Terkini, Terpopuler, Terbaru', 1),
(13, 'Tribunnews', 'https://www.tribunnews.com/rss', 'News', false, NOW(), NOW(), '/assets/logos/tribunnews.png', 'Tribunnews.com', 1),
(18, 'Tirto', 'https://tirto.id/sitemap/r/google-discover', 'News', false, NOW(), NOW(), '/assets/logos/tirto.png', 'tirto.id', 1),
(15, 'Tempo Nasional', 'https://rss.tempo.co/nasional', 'News', false, NOW(), NOW(), '/assets/logos/tempo-nasional.png', 'Tempo.co Berita Nasional Terbaru Indonesia Hari Ini RSS', 1),
(35, 'TV Papua', 'https://tvpapua.com/feed/', 'News', true, NOW(), NOW(), 'http://tvpapua.com/wp-content/uploads/2017/02/new1TVpapua.png', NULL, NULL),
(26, 'CNN Nasional', 'https://www.cnnindonesia.com/nasional/rss', 'News', false, NOW(), NOW(), '/assets/logos/cnn-nasional.png', 'CNN Indonesia | Berita Terkini Nasional', 1),
(25, 'CNBC News', 'https://www.cnbcindonesia.com/news/rss', 'News', false, NOW(), NOW(), '/assets/logos/cnbc-news.png', 'News - Berita Terkini Indonesia dan Dunia - CNBC Indonesia', 1)
ON CONFLICT (id) DO NOTHING;

-- Update sequences to match current max IDs
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('settings_id_seq', (SELECT MAX(id) FROM settings));
SELECT setval('rss_sources_id_seq', (SELECT MAX(id) FROM rss_sources));

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify:
-- SELECT COUNT(*) FROM rss_sources;  -- should be 26
-- SELECT COUNT(*) FROM categories;   -- should be 15
-- SELECT COUNT(*) FROM settings;     -- should be 12
