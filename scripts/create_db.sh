#!/bin/bash

DB_NAME="$1"
DB_USER="$2"
DB_PASS="$3"
ADMIN_USER="$4"
ADMIN_PASS="$5"

if [[ -z "$DB_NAME" || -z "$DB_USER" || -z "$DB_PASS" || -z "$ADMIN_USER" || -z "$ADMIN_PASS" ]]; then
  echo "Usage: create_db.sh <db_name> <db_user> <db_pass> <admin_user> <admin_pass>"
  exit 1
fi

echo "Checking if database $DB_NAME exists..."
DB_EXISTS=$(docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" || echo "")

if [ -z "$DB_EXISTS" ]; then
  echo "Creating database $DB_NAME..."
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "CREATE DATABASE $DB_NAME;"
  
  echo "Creating user $DB_USER..."
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
  
  echo "Granting privileges..."
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
  
  # Grant schema permissions needed for migrations
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
  
  # Grant permissions on existing tables
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;"
  
  echo "Database and user created successfully."
else
  echo "Database $DB_NAME already exists."
fi