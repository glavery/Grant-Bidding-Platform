#!/bin/bash
# Run the database schema

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Source environment variables from .env file
source "$PROJECT_ROOT/.env"

# Use absolute path to the database schema file
psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -f "$PROJECT_ROOT/sql/database_schema.sql"