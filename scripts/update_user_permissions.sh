#!/bin/bash

DB_NAME="$1"
USER_NAME="$2"
ADMIN_USER="$3"
ADMIN_PASS="$4"

if [[ -z "$DB_NAME" || -z "$USER_NAME" || -z "$ADMIN_USER" || -z "$ADMIN_PASS" ]]; then
  echo "Usage: update_user_permissions.sh <db_name> <user_name> <admin_user> <admin_pass>"
  exit 1
fi

echo "Checking if user $USER_NAME exists..."
USER_EXISTS=$(docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$USER_NAME'" || echo "")

if [ -z "$USER_EXISTS" ]; then
  echo "Error: User $USER_NAME does not exist. Use create_user.sh to create a new user first."
  exit 1
else
  echo "Updating permissions for user $USER_NAME on database $DB_NAME..."
  
  # Grant database privileges
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $USER_NAME;"
  
  # Grant schema permissions needed for migrations
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $USER_NAME;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $USER_NAME;"
  
  # Grant permissions on existing tables
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $USER_NAME;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $USER_NAME;"
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $USER_NAME;"
  
  echo "Permissions updated successfully for user $USER_NAME."
fi 