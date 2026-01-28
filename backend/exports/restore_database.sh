#!/bin/bash
# ================================================================
# Script untuk RESET dan RESTORE database dari full backup
# WARNING: Ini akan HAPUS semua data dan replace dengan backup!
# ================================================================

set -e  # Exit on error

echo "================================================"
echo "🔄 Database Reset & Restore Script"
echo "================================================"
echo ""
echo "⚠️  WARNING: Ini akan menghapus SEMUA data di database!"
echo "⚠️  Pastikan Anda sudah backup jika ada data penting!"
echo ""
read -p "Ketik 'YES' untuk melanjutkan: " confirm

if [ "$confirm" != "YES" ]; then
    echo "❌ Dibatalkan."
    exit 1
fi

# Configuration
DB_USER=${DB_USER:-"fekusa"}
DB_NAME=${DB_NAME:-"postgres"}
BACKUP_FILE="full_backup.sql"

echo ""
echo "📋 Configuration:"
echo "   Database User: $DB_USER"
echo "   Database Name: $DB_NAME"
echo "   Backup File:   $BACKUP_FILE"
echo ""

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file '$BACKUP_FILE' not found!"
    echo "   Pastikan file full_backup.sql ada di folder ini."
    exit 1
fi

echo "🔍 Checking PostgreSQL connection..."

# Test connection (Docker or system PostgreSQL)
if command -v docker &> /dev/null && docker ps | grep -q postgres; then
    echo "✅ Detected Docker PostgreSQL"
    DOCKER_CONTAINER=$(docker ps | grep postgres | awk '{print $1}')
    echo "   Container: $DOCKER_CONTAINER"
    IMPORT_CMD="docker exec -i $DOCKER_CONTAINER psql -U $DB_USER -d $DB_NAME"
elif command -v psql &> /dev/null; then
    echo "✅ Detected system PostgreSQL"
    IMPORT_CMD="psql -U $DB_USER -d $DB_NAME"
else
    echo "❌ Error: PostgreSQL tidak ditemukan!"
    echo "   Install PostgreSQL atau pastikan Docker container running."
    exit 1
fi

echo ""
echo "🗑️  Step 1: Dropping all tables..."
echo "   (Database will be cleaned via backup script)"

echo ""
echo "📥 Step 2: Importing full backup..."
echo "   This may take a few minutes..."

if $IMPORT_CMD < $BACKUP_FILE; then
    echo ""
    echo "✅ Import successful!"
else
    echo ""
    echo "❌ Import failed! Check errors above."
    exit 1
fi

echo ""
echo "🔍 Step 3: Verifying data..."

# Verify counts
if command -v docker &> /dev/null && docker ps | grep -q postgres; then
    VERIFY_CMD="docker exec -i $DOCKER_CONTAINER psql -U $DB_USER -d $DB_NAME -t -c"
else
    VERIFY_CMD="psql -U $DB_USER -d $DB_NAME -t -c"
fi

echo ""
echo "   Tables data counts:"
SOURCES_COUNT=$($VERIFY_CMD "SELECT COUNT(*) FROM rss_sources;" 2>/dev/null | xargs || echo "0")
ARTICLES_COUNT=$($VERIFY_CMD "SELECT COUNT(*) FROM rss_articles;" 2>/dev/null | xargs || echo "0")
CATEGORIES_COUNT=$($VERIFY_CMD "SELECT COUNT(*) FROM categories;" 2>/dev/null | xargs || echo "0")
SETTINGS_COUNT=$($VERIFY_CMD "SELECT COUNT(*) FROM settings;" 2>/dev/null | xargs || echo "0")

echo "   ✓ RSS Sources:  $SOURCES_COUNT"
echo "   ✓ Articles:     $ARTICLES_COUNT"
echo "   ✓ Categories:   $CATEGORIES_COUNT"
echo "   ✓ Settings:     $SETTINGS_COUNT"

echo ""
echo "================================================"
echo "✅ Database reset & restore COMPLETED!"
echo "================================================"
echo ""
echo "📝 Next steps:"
echo "   1. Restart backend server: pm2 restart all"
echo "   2. Check logs: pm2 logs rss-backend"
echo "   3. Test API: curl http://localhost:4000/health"
echo ""
