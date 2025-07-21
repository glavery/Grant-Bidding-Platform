#!/bin/bash
# Script to create the database and user with proper permissions

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Source environment variables from .env file
source "$PROJECT_ROOT/.env"

# Default to system username as PostgreSQL superuser (common on macOS)
PG_SUPERUSER=${1:-$(whoami)}

echo "Using PostgreSQL superuser: $PG_SUPERUSER"

# Generate SQL file from template by replacing environment variables
TEMPLATE_FILE="$PROJECT_ROOT/sql/create_database.sql.template"
SQL_FILE="$PROJECT_ROOT/sql/create_database.sql"

# Create a temporary file with environment variables replaced
envsubst < "$TEMPLATE_FILE" > "$SQL_FILE"

# Run the database creation SQL script
# This needs to be run as a PostgreSQL superuser
# Connect to the 'postgres' database which is a standard default database
psql -h "${DB_HOST}" -U $PG_SUPERUSER -d postgres -f "$SQL_FILE"

# Check if the psql command was successful
if [ $? -eq 0 ]; then
    echo "Database and user created with proper permissions."
else
    echo "Error: Failed to create database and user. Please check your PostgreSQL configuration."
    exit 1
fi