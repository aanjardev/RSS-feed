# Database Export

Data export dari development untuk deployment ke production server.

## Files
- `import_all_complete.sql` - **✅ USE THIS** - Schema + Data dalam 1 file
- `schema.sql` - Complete database schema only (all tables structure)
- `rss_sources_data.sql` - 26 RSS sources with logos (data only)
- `categories_data.sql` - 15 categories (data only)
- `settings_data.sql` - 12 default settings (data only)
- `import_all.sql` - Data only (needs schema first)

## Cara Import di Server

### ✅ RECOMMENDED - Import Complete (Schema + Data)
```bash
# Local psql
psql -U username -d database_name < import_all_complete.sql

# Docker container
docker exec -i container_name psql -U username -d database_name < import_all_complete.sql
```

### Option 2: Import per file (troubleshooting)
```bash
# 1. Create schema first
psql -U username -d database_name < schema.sql

# 2. Import data
psql -U username -d database_name < categories_data.sql
psql -U username -d database_name < rss_sources_data.sql
psql -U username -d database_name < settings_data.sql
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
