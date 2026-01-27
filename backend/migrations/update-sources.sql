-- Clear old sources
DELETE FROM rss_sources;

-- Add logo column if not exists
ALTER TABLE rss_sources ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE rss_sources ADD COLUMN IF NOT EXISTS description TEXT;

-- Insert Indonesian RSS sources from rss-feeds.json
INSERT INTO rss_sources (name, url, logo, description, category, is_active) VALUES
  ('Tempo Bisnis', 'https://rss.tempo.co/bisnis', 'http://www.tilikfeed.com/logos/icons/tempo.png', 'Tempo.co Berita Bisnis Terkini Indonesia dan Dunia RSS', 'Business', true),
  ('Liputan 6', 'https://feed.liputan6.com/rss/news', 'http://www.tilikfeed.com/logos/icons/liputan6.jpeg', 'Liputan6.com Politik', 'News', true),
  ('Tribunnews', 'https://www.tribunnews.com/rss', 'http://www.tilikfeed.com/logos/icons/tribunnews.png', 'Tribunnews.com', 'News', true),
  ('CNBC Market', 'https://www.cnbcindonesia.com/market/rss/', 'http://www.tilikfeed.com/logos/icons/CNBC_Indonesia.png', 'Market - Berita Terkini Market, Saham, Reksadana - CNBC Indonesia', 'Business', true),
  ('Tempo Nasional', 'https://rss.tempo.co/nasional', 'http://www.tilikfeed.com/logos/icons/tempo.png', 'Tempo.co Berita Nasional Terbaru Indonesia Hari Ini RSS', 'News', true),
  ('Republika', 'https://www.republika.co.id/rss', 'http://www.tilikfeed.com/logos/icons/republika.png', 'Republika Online RSS Feed', 'News', true),
  ('Okezone', 'https://sindikasi.okezone.com/index.php/rss/0/RSS2.0', 'http://www.tilikfeed.com/logos/icons/okezone.png', 'Sindikasi economy.okezone.com', 'Business', true),
  ('Tirto', 'https://tirto.id/sitemap/r/google-discover', 'http://www.tilikfeed.com/logos/icons/tirto.png', 'tirto.id', 'News', true),
  ('Detik News', 'https://news.detik.com/berita/rss', 'http://www.tilikfeed.com/logos/icons/detik.png', 'Berita - Detikcom', 'News', true),
  ('Detik Finance', 'https://finance.detik.com/rss', 'http://www.tilikfeed.com/logos/icons/detik.png', 'Finance - Detikcom', 'Business', true),
  ('Viva', 'https://www.viva.co.id/get/all', 'http://www.tilikfeed.com/logos/icons/viva1.png', 'VIVA - Berita Harian Terkini, Terpopuler, Terbaru', 'News', true),
  ('Kumparan', 'https://lapi.kumparan.com/v2.0/rss/', 'http://www.tilikfeed.com/logos/icons/kumparan2.png', 'kumparan - #kumparanAdalahJawaban', 'News', true),
  ('Suara Pembaharuan', 'https://www.suarapembaharuan.com/feeds/posts/default', 'http://www.tilikfeed.com/logos/icons/suara-pembaharuan.png', 'Suara Pembaharuan', 'News', true),
  ('SindoNews', 'https://www.sindonews.com/feed', 'http://www.tilikfeed.com/logos/icons/sindonews1.png', 'Berita Terkini dan Informasi Terbaru Hari Ini - SINDOnews', 'News', true),
  ('CNBC News', 'https://www.cnbcindonesia.com/news/rss', 'http://www.tilikfeed.com/logos/icons/CNBC_Indonesia.png', 'News - Berita Terkini Indonesia dan Dunia - CNBC Indonesia', 'News', true),
  ('CNN Nasional', 'https://www.cnnindonesia.com/nasional/rss', 'http://www.tilikfeed.com/logos/icons/CNN_Indonesia.png', 'CNN Indonesia | Berita Terkini Nasional', 'News', true),
  ('CNN Ekonomi', 'https://www.cnnindonesia.com/ekonomi/rss', 'http://www.tilikfeed.com/logos/icons/CNN_Indonesia.png', 'CNN Indonesia | Berita Terkini Ekonomi', 'Business', true),
  ('Antara', 'https://www.antaranews.com/rss/top-news', 'http://www.tilikfeed.com/logos/icons/antaranews2.png', 'Berita Top News - ANTARA News', 'News', true)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  logo = EXCLUDED.logo,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;
