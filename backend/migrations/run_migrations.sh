#!/bin/bash

# Run all migrations in order
# Usage: ./run_migrations.sh

echo "🚀 Running database migrations..."

# Load environment variables from .env file
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

# Database connection details from .env or defaults
DB_CONTAINER="${DB_CONTAINER:-postgres17}"
DB_USER="${DB_USER:-fekusa}"
DB_NAME="${DB_NAME:-postgres}"

# Check if Docker container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo "❌ Error: Docker container '$DB_CONTAINER' is not running"
    exit 1
fi

# Array of migration files in order
MIGRATIONS=(
    "002_add_categories.sql"
    "003_add_settings.sql"
    "004_add_users.sql"
    "005_add_logo_settings.sql"
    "006_add_custom_articles.sql"
)

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run each migration
for migration in "${MIGRATIONS[@]}"; do
    MIGRATION_FILE="$SCRIPT_DIR/$migration"
    
    if [ ! -f "$MIGRATION_FILE" ]; then
        echo "⚠️  Warning: Migration file not found: $migration"
        continue
    fi
    
    echo "📝 Running migration: $migration"
    
    if docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME < "$MIGRATION_FILE" 2>&1 | grep -q "ERROR"; then
        echo "❌ Error running migration: $migration"
        echo "   Check if migration was already applied or if there are SQL errors"
    else
        echo "✅ Successfully applied: $migration"
    fi
    echo ""
done

echo "🎉 Migration process completed!"
echo ""
echo "📊 Current database tables:"
docker exec $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -c "\dt"
