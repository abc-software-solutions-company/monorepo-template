#!/bin/bash

DB_NAME="$1"
NEW_USER="$2"
NEW_PASS="$3"
ADMIN_USER="$4"
ADMIN_PASS="$5"

if [[ -z "$DB_NAME" || -z "$NEW_USER" || -z "$NEW_PASS" || -z "$ADMIN_USER" || -z "$ADMIN_PASS" ]]; then
  echo "Usage: create_user.sh <db_name> <new_user> <new_pass> <admin_user> <admin_pass>"
  exit 1
fi

echo "Checking if user $NEW_USER exists..."
USER_EXISTS=$(docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$NEW_USER'" || echo "")

if [ -z "$USER_EXISTS" ]; then
  echo "Creating user $NEW_USER..."
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "CREATE USER $NEW_USER WITH PASSWORD '$NEW_PASS';"
  
  echo "Granting privileges to $NEW_USER on $DB_NAME..."
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $NEW_USER;"
  
  # Grant schema permissions needed for migrations
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $USER_NAME;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $USER_NAME;"
  
  # Grant permissions on existing tables
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $USER_NAME;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $USER_NAME;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $USER_NAME;"
  
  echo "User created successfully."
else
  echo "User $NEW_USER already exists."
fi