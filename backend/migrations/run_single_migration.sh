#!/bin/bash

# Run a single migration file
# Usage: ./run_single_migration.sh <migration_file.sql>

if [ $# -eq 0 ]; then
    echo "❌ Error: No migration file specified"
    echo "Usage: ./run_single_migration.sh <migration_file.sql>"
    echo ""
    echo "Available migrations:"
    ls -1 *.sql 2>/dev/null | grep -E '^[0-9]{3}_.*\.sql$'
    exit 1
fi

MIGRATION_FILE="$1"

# Load environment variables from .env file
if [ -f "../.env" ]; then
    export $(grep -v '^#' ../.env | xargs)
fi

# Database config from .env or defaults
DB_CONTAINER="${DB_CONTAINER:-postgres17}"
DB_USER="${DB_USER:-fekusa}"
DB_NAME="${DB_NAME:-postgres}"

# Check if file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found: $MIGRATION_FILE"
    exit 1
fi

# Check if Docker container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "❌ Error: Docker container '$DB_CONTAINER' is not running"
    exit 1
fi

echo "🚀 Running migration: $MIGRATION_FILE"
echo "📦 Container: $DB_CONTAINER"
echo "👤 User: $DB_USER"
echo "🗄️  Database: $DB_NAME"
echo ""

# Run the migration
docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME < "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
else
    echo ""
    echo "❌ Migration failed! Check the errors above."
    exit 1
fi
