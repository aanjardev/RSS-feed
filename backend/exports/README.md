# Database Export & Restore

Data export dari development untuk deployment ke production server.

## Files
- **`full_backup.sql`** - ✅ **COMPLETE BACKUP** - Schema + ALL data (2.2MB, includes all articles)
- **`restore_database.sh`** - 🔧 **AUTO RESTORE SCRIPT** - Delete & import otomatis
- `import_all_complete.sql` - Schema + master data only (tanpa articles)
- `schema.sql` - Database schema only
- `rss_sources_data.sql` - RSS sources data only
- `categories_data.sql` - Categories data only
- `settings_data.sql` - Settings data only

## Cara Import di Server

### ✅ RECOMMENDED - Auto Restore (Paling Mudah!)
Script ini akan otomatis delete & restore database:

```bash
cd ~/RSS-feed/backend/exports
chmod +x restore_database.sh
./restore_database.sh
```

Script akan:
- ✓ Drop semua tables existing
- ✓ Import full backup (schema + data + articles)
- ✓ Verify data counts
- ✓ Auto-detect Docker atau system PostgreSQL

### Manual Import (Alternative)

**Option 1 - Full Backup (termasuk articles):**
```bash
# Docker PostgreSQL
docker exec -i container_name psql -U username -d postgres < full_backup.sql

# System PostgreSQL
psql -U username -d postgres < full_backup.sql
```

**Option 2 - Master Data Only (tanpa articles):**
```bash
psql -U username -d postgres < import_all_complete.sql
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
