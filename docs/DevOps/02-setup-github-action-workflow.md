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

File YAML: .github/workflows/admin-portal.stage.yml


#### Admin API Workflow

File YAML: .github/workflows/api-admin.stage.yml


#### Website Workflow

File YAML: .github/workflows/website.stage.yml

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
