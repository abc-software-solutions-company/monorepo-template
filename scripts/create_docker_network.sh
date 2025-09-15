#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

NETWORK_NAME="abc_infra"
FORCE_RECREATE=false

echo "=== Docker Network Setup ==="
echo "Docker version: $(docker --version)"
echo "Target network: $NETWORK_NAME"

# Check for --force flag
for arg in "$@"; do
  case $arg in
    --force)
      FORCE_RECREATE=true
      echo "Force recreation enabled"
      shift
      ;;
  esac
done

# List all networks for debugging
echo "Existing Docker networks:"
docker network ls

# Check if network already exists with exact name
if docker network ls --format '{{.Name}}' | grep -x "$NETWORK_NAME" > /dev/null 2>&1; then
  echo "Network $NETWORK_NAME already exists with exact name"
  
  # Check if network is being used by any containers
  CONTAINERS=$(docker network inspect -f '{{range .Containers}}{{.Name}} {{end}}' "$NETWORK_NAME" 2>/dev/null || echo "")
  
  if [ -n "$CONTAINERS" ]; then
    echo "Network is being used by containers: $CONTAINERS"
    
    if [ "$FORCE_RECREATE" = true ]; then
      echo "Force flag set, disconnecting containers from network..."
      
      for CONTAINER in $CONTAINERS; do
        echo "Disconnecting $CONTAINER from $NETWORK_NAME"
        docker network disconnect -f "$NETWORK_NAME" "$CONTAINER" || echo "Warning: Failed to disconnect $CONTAINER"
      done
    else
      echo "⚠️ Network in use but force flag not set. Use --force to disconnect containers."
      echo "Using existing network instead of creating a new one."
      exit 0
    fi
  fi
  
  echo "Removing existing network $NETWORK_NAME..."
  # Use set +e to continue script even if command fails
  set +e
  docker network rm "$NETWORK_NAME"
  REMOVE_STATUS=$?
  set -e
  
  if [ $REMOVE_STATUS -ne 0 ]; then
    echo "❌ Failed to remove network. It may still be in use by containers."
    echo "Current Docker networks:"
    docker network ls
    echo "Current Docker containers:"
    docker ps -a
    
    if [ "$FORCE_RECREATE" = false ]; then
      echo "Try again with the --force flag"
    else
      echo "Force flag was used but network still couldn't be removed"
      echo "You may need to manually stop or disconnect containers"
    fi
    exit 1
  fi
fi

# Create network with attachable flag
echo "Creating network $NETWORK_NAME..."
set +e
docker network create --attachable --driver bridge "$NETWORK_NAME"
CREATE_STATUS=$?
set -e

if [ $CREATE_STATUS -ne 0 ]; then
  echo "❌ Failed to create network $NETWORK_NAME"
  echo "Current Docker networks:"
  docker network ls
  exit 1
fi

# Verify network was created correctly
if docker network ls --format '{{.Name}}' | grep -x "$NETWORK_NAME" > /dev/null 2>&1; then
  echo "Network $NETWORK_NAME was created successfully"
  
  # Check if network is attachable and using bridge driver
  DRIVER=$(docker network inspect -f '{{.Driver}}' "$NETWORK_NAME" 2>/dev/null || echo "unknown")
  ATTACHABLE=$(docker network inspect -f '{{.Attachable}}' "$NETWORK_NAME" 2>/dev/null || echo "unknown")
  
  echo "Network properties:"
  echo "  - Driver: $DRIVER (should be 'bridge')"
  echo "  - Attachable: $ATTACHABLE (should be 'true')"
  
  if [ "$DRIVER" = "bridge" ] && [ "$ATTACHABLE" = "true" ]; then
    echo "✅ Network $NETWORK_NAME is properly configured for external use in docker-compose"
    echo "Full network details:"
    docker network inspect "$NETWORK_NAME"
    echo
    echo "Remember to update your docker-compose.yml to use this network name"
  else
    echo "⚠️ Network $NETWORK_NAME may not be properly configured for external use"
  fi
else
  echo "❌ Failed to create network $NETWORK_NAME"
  echo "Current Docker networks:"
  docker network ls
  exit 1
fi