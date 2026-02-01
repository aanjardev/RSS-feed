-- Update papua.news logo to use the same path as favicon
-- First, get the favicon_url from settings and use it for papua.news logo

UPDATE rss_sources 
SET logo = (SELECT value FROM settings WHERE key = 'favicon_url' LIMIT 1)
WHERE name IN ('papua.news', 'Papua.News', 'Papua News', 'Editorial', 'Editorial Team')
  OR is_custom = true;
