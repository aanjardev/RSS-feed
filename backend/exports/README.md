# Database Export

Data export dari development untuk deployment ke production server.

## Files
- `schema.sql` - Complete database schema (all tables structure)
- `rss_sources_data.sql` - 18 Indonesian RSS sources with logos
- `categories_data.sql` - 15 categories (5 default + 10 Indonesian)
- `settings_data.sql` - 12 default settings
- `import_all.sql` - Combined import script

## Cara Import di Server

### Option 1: Import semua sekaligus
```bash
psql -U username -d database_name < import_all.sql
```

### Option 2: Import per file (lebih aman)
```bash
# 1. Create schema first
psql -U username -d database_name < schema.sql

# 2. Import data
psql -U username -d database_name < categories_data.sql
psql -U username -d database_name < rss_sources_data.sql
psql -U username -d database_name < settings_data.sql
```

### Option 3: Docker container (seperti di development)
```bash
docker exec -i container_name psql -U username -d database_name < import_all.sql
```

## Notes
- Articles tidak di-export karena akan di-scrape otomatis oleh cron job
- Logo files ada di `/public/assets/logos/` - copy manual ke server
- Setelah import, restart backend server untuk apply changes
- Cron job akan mulai scraping articles setiap 15 menit

## Verify Import
```sql
-- Check counts
SELECT COUNT(*) FROM rss_sources;  -- should be 18
SELECT COUNT(*) FROM categories;   -- should be 15
SELECT COUNT(*) FROM settings;     -- should be 12

-- Check active sources
SELECT name, url FROM rss_sources WHERE is_active = true;
```
