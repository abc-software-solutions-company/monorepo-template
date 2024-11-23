# Setting Up GitHub Action Workflows with Secrets

## Introduction

This document provides a step-by-step guide to setting up GitHub Action workflows for deploying applications to a staging environment. It also
includes instructions on configuring secrets and checking Docker processes to select available ports.

## Prerequisites

- A GitHub repository with the necessary application code.
- Access to a staging server with Docker installed.
- SSH access to the staging server.

## Setting Up GitHub Action Workflows

### Step 1: Define Workflows

Create YAML files in the `.github/workflows` directory of your repository. Below are examples for different applications: Also we can see the full
workflow code in this repository files

#### Admin Portal Workflow

```yaml:.github/workflows/admin-portal.stage.yml
name: Deploy Admin Portal (Stage)

on:
  push:
    branches:
      - 'main'
    paths:
      - 'apps/admin-portal/**'

env:
  APP_ENV: ${{ secrets.PORTAL_STAGE }}
  APP_NAME: admin-portal-stage
  DOCKER_COMPOSE_SERVICE: admin-portal-stage-deploy
  DOCKERFILE_PATH: apps/admin-portal/Dockerfile
  DOCKER_COMPOSE_PATH: apps/admin-portal/docker-compose.yml
  ENV_FILE_PATH: apps/admin-portal/.env
  DOCKER_MAP_PORT: 3001:3001

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Pull code
        uses: actions/checkout@v3
      # ... other steps ...
```

#### Admin API Workflow

```yaml:.github/workflows/api-admin.stage.yml
name: Deploy Admin API (Stage)

on:
  push:
    branches:
      - 'main'
    paths:
      - 'apps/api/**'

env:
  APP_ENV: ${{ secrets.API_STAGE }}
  APP_NAME: api-stage
  DOCKER_COMPOSE_SERVICE: monorepo-api
  DOCKERFILE_PATH: apps/api/Dockerfile
  DOCKER_COMPOSE_PATH: apps/api/docker-compose.yml
  ENV_FILE_PATH: apps/api/.env
  DOCKER_MAP_PORT: 3500:3500

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Pull code
        uses: actions/checkout@v3
      # ... other steps ...
```

#### Website Workflow

```yaml:.github/workflows/website.stage.yml
name: Deploy Website (Stage)

on:
  push:
    branches:
      - 'main'
    paths:
      - 'apps/website/**'

env:
  APP_ENV: ${{ secrets.WEBSITE_STAGE }}
  APP_NAME: website-stage-deploy
  DOCKER_COMPOSE_SERVICE: website-stage-deploy
  DOCKERFILE_PATH: apps/website/Dockerfile
  DOCKER_COMPOSE_PATH: apps/website/docker-compose.yml
  ENV_FILE_PATH: apps/website/.env
  DOCKER_MAP_PORT: 3000:3001

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Pull code
        uses: actions/checkout@v3
      # ... other steps ...
```

### Step 2: Configure Secrets

1. Navigate to your GitHub repository.
2. Go to **Settings → Secrets and variables → Actions**.
3. Click on **New repository secret**.
4. Add the following secrets:

   - **`STAGE_SERVER_HOST`**: Hostname or IP address of your staging server.
   - **`STAGE_SERVER_USER_NAME`**: SSH username for the staging server.
   - **`STAGE_SERVER_PASSWORD`**: SSH password for the staging server.
   - **`PORTAL_STAGE`**, **`API_STAGE`**, **`WEBSITE_STAGE`**: Environment variables for each application.

## Checking Docker Processes and Selecting Available Ports

### Step 1: Check Running Docker Containers

SSH into your staging server and run the following command to list all running Docker containers:

```bash
docker ps
```

This command will display a list of running containers along with their port mappings.

### Step 2: Identify Available Ports

Review the output of `docker ps` to identify which ports are currently in use. Choose a port that is not listed to avoid conflicts.

### Step 3: Update Workflow Files

Once you have identified an available port, update the `DOCKER_MAP_PORT` environment variable in your workflow files to use this port.

```yaml
env:
  DOCKER_MAP_PORT: <available_port>:<internal_port>
```

Replace `<available_port>` with the port you identified as available, and `<internal_port>` with the port your application listens on internally.

## Conclusion

By following this guide, you can set up GitHub Action workflows with secrets and ensure your applications are deployed smoothly to a staging
environment. Regularly check Docker processes and update port mappings to avoid conflicts and ensure successful deployments.
