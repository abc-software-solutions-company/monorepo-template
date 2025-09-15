#!/bin/bash

DB_NAME="$1"
DB_USER="$2"
ADMIN_USER="$3"
ADMIN_PASS="$4"

if [[ -z "$DB_NAME" || -z "$DB_USER" || -z "$ADMIN_USER" || -z "$ADMIN_PASS" ]]; then
  echo "Usage: delete_db.sh <db_name> <db_user> <admin_user> <admin_pass>"
  exit 1
fi

echo "Checking if database $DB_NAME exists..."
DB_EXISTS=$(docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" || echo "")

if [ -n "$DB_EXISTS" ]; then
  echo "Terminating all connections to database $DB_NAME..."
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME';"
  
  echo "Dropping database $DB_NAME..."
  docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"
  
  echo "Checking if user $DB_USER exists..."
  USER_EXISTS=$(docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" || echo "")
  
  if [ -n "$USER_EXISTS" ]; then
    echo "Dropping user $DB_USER..."
    docker exec -e PGPASSWORD="$ADMIN_PASS" postgres psql -U "$ADMIN_USER" -c "DROP USER IF EXISTS $DB_USER;"
    echo "User dropped successfully."
  else
    echo "User $DB_USER doesn't exist."
  fi
  
  echo "Database deleted successfully."
else
  echo "Database $DB_NAME doesn't exist."
fi 