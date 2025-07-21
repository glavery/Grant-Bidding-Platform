-- In PostgreSQL console
CREATE DATABASE grants_db;
CREATE USER grants_user WITH PASSWORD 'grants_password';
GRANT ALL PRIVILEGES ON DATABASE grants_db TO grants_user;

-- Connect to the grants_db to set schema permissions
\c grants_db

-- Grant schema permissions to grants_user
GRANT USAGE, CREATE ON SCHEMA public TO grants_user;

-- Grant permissions on future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO grants_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO grants_user;

\q