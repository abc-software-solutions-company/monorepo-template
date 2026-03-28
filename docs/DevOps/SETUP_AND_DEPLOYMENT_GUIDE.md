# VPS Setup & GitHub Actions Deployment Guide

This guide covers everything you need to deploy this monorepo to a VPS using GitHub Actions.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: Clone Project to VPS and Publish to GitHub](#part-1-clone-project-to-vps-and-publish-to-github)
3. [Part 2: Create SSH Key for VPS](#part-2-create-ssh-key-for-vps)
4. [Part 3: Configure GitHub Secrets](#part-3-configure-github-secrets)
5. [Part 4: Initial VPS Setup](#part-4-initial-vps-setup)
6. [Part 5: Infrastructure Setup](#part-5-infrastructure-setup)
7. [Part 6: Deploy Applications](#part-6-deploy-applications)
8. [Workflow Reference](#workflow-reference)

---

## Prerequisites

- A VPS with Ubuntu/Debian (tested on Namecheap, Digital Ocean, and AWS LightSail)
- GitHub account with permissions to add secrets and run workflows
- Git installed on your local machine

---

## Part 1: Clone Project to VPS and Publish to GitHub

### Step 1.1: Clone the Project to Your VPS

SSH into your VPS and clone the project:

```bash
ssh user@your-vps-ip
git clone https://github.com/abc-software-solutions-company/monorepo-template.git /opt/monorepo-template
```

### Step 1.2: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right corner → **New repository**
3. Fill in the repository details:
   - **Name:** `monorepo-template` (or your preferred name)
   - **Description:** Your monorepo project
   - **Visibility:** Choose Public or Private
   - **Do NOT** initialize with README (since you're pushing an existing project)
4. Click **Create repository**

### Step 1.3: Update Git Remote on VPS

On your VPS, navigate to the project and update the remote:

```bash
cd /opt/monorepo-template
git remote set-url origin https://github.com/your-username/your-repo-name.git
git remote -v  # Verify the remote is set correctly
```

### Step 1.4: Push to GitHub

```bash
cd /opt/monorepo-template
git push -u origin main
```

Enter your GitHub credentials when prompted.

### Step 1.5: Generate a GitHub Personal Access Token

To enable GitHub Actions to push images to GitHub Container Registry:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. Click **Generate new token**
3. Configure the token:
   - **Name:** `vps-deploy-token`
   - **Expiration:** 30 days (or as needed)
   - **Repository access:** Select your repository
   - **Permissions:**
     - `packages: write`
     - `pull-requests: write`
     - `contents: write`
4. Click **Generate token** and copy the token value

---

## Part 2: Create SSH Key for VPS

### Step 2.1: Generate SSH Key Pair on Your Local Machine

On your **local machine** (not the VPS), generate a new SSH key pair:

```bash
# Generate a new ED25519 key (recommended)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/vps_deploy

# OR generate RSA key (if your server doesn't support ED25519)
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/vps_deploy
```

When prompted for a passphrase, press **Enter** for no passphrase (required for automated deployments).

### Step 2.2: Copy Public Key to VPS

```bash
# Copy the public key to your VPS
ssh-copy-id -i ~/.ssh/vps_deploy.pub user@your-vps-ip

# Example:
ssh-copy-id -i ~/.ssh/vps_deploy.pub root@103.999.888.777
```

### Step 2.3: Test the Connection

```bash
ssh -i ~/.ssh/vps_deploy user@your-vps-ip
```

### Step 2.4: Add Private Key to GitHub Secrets

1. Read your private key content:

```bash
cat ~/.ssh/vps_deploy
```

2. In your GitHub repository, go to **Settings → Secrets and variables → Actions**

3. Click **New repository secret** and add:

| Secret Name | Value |
|-------------|-------|
| `VPS_SSH_KEY` | (Paste the entire private key content including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) |

### Step 2.5: Add VPS IP/Hostname to GitHub Secrets

| Secret Name | Value |
|-------------|-------|
| `VPS_HOST` | `your-vps-ip-or-hostname` (e.g., `103.999.888.777`) |
| `VPS_USER` | `root` (or your deploy user) |

---

## Part 3: Configure GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add all required secrets:

### Required SSH/Server Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VPS_SSH_KEY` | Private SSH key for VPS access | (content of `~/.ssh/vps_deploy`) |
| `VPS_HOST` | VPS IP address or hostname | `103.999.888.777` |
| `VPS_USER` | SSH user on VPS | `root` |

### Required for API Deployment

| Secret Name | Description |
|-------------|-------------|
| `API_DB_URL` | PostgreSQL connection string |
| `API_JWT_SECRET_KEY` | JWT signing secret |
| `API_JWT_REFRESH_SECRET_KEY` | JWT refresh signing secret |
| `API_AWS_ACCESS_KEY_ID` | AWS access key |
| `API_AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `API_STRIPE_SECRET_KEY` | Stripe secret key |
| `API_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `API_STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `API_WHATSAPP_ACCESS_TOKEN` | WhatsApp API token |
| `API_WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID |
| `API_WHATSAPP_RECIPIENT_PHONE` | Default recipient phone |
| `API_SMTP_HOST` | SMTP server hostname |
| `API_SMTP_USER` | SMTP username |
| `API_SMTP_PASS` | SMTP password |
| `API_MICROSOFT_GRAPH_TENANT_ID` | Azure AD tenant ID |
| `API_MICROSOFT_GRAPH_CLIENT_ID` | Azure AD client ID |
| `API_MICROSOFT_GRAPH_CLIENT_SECRET` | Azure AD client secret |
| `FIREBASE_CONFIG` | Firebase service account JSON (as single line) |

### Required for Website Deployment

| Secret Name | Description |
|-------------|-------------|
| `WEBSITE_NEXT_PUBLIC_API_URL` | API URL for website |
| `WEBSITE_NEXTAUTH_SECRET` | NextAuth secret |
| `WEBSITE_NEXTAUTH_URL` | Canonical URL |

### Database Backup Secrets

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key (for S3 backups) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `S3_BUCKET_NAME` | S3 bucket for backups |
| `S3_REGION` | S3 region (e.g., `ap-southeast-1`) |

---

## Part 4: Initial VPS Setup

### Step 4.1: Install Docker on VPS

Use the GitHub Actions workflow to install Docker:

1. Go to **Actions** tab in your GitHub repository
2. Select **"Install Docker on VPS"** workflow from the list
3. Click **Run workflow** button on the right
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root` (or your deploy user)
5. Click **Run workflow**

Wait for the workflow to complete. You can monitor progress in the **Actions** tab.

### Step 4.2: Add Swap Memory (Recommended)

For servers with less than 2GB RAM:

1. Go to **Actions** tab
2. Select **"Add Swap Memory"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
   - `swap_size`: `2G` (or your preferred size)
5. Click **Run workflow**

### Step 4.3: Create Docker Networks

1. Go to **Actions** tab
2. Select **"Setup Infrastructure Network"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
5. Click **Run workflow**

This creates:
- `abc_infra` - For staging infrastructure
- `abc_prod_infra` - For production infrastructure

---

## Part 5: Infrastructure Setup

### Step 5.1: Deploy PostgreSQL (Staging)

1. Go to **Actions** tab
2. Select **"Deploy PostgreSQL"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
   - `db_password`: your-staging-db-password
   - `postgres_port`: `5432`
   - `environment`: `staging`
5. Click **Run workflow**

**PostgreSQL will be available at:** `postgresql://postgres:your-db-password@localhost:5432/postgres`

### Step 5.2: Deploy PostgreSQL (Production)

1. Go to **Actions** tab
2. Select **"Deploy PostgreSQL"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
   - `db_password`: your-production-db-password
   - `postgres_port`: `5433`
   - `environment`: `production`
5. Click **Run workflow**

### Step 5.3: Deploy Portainer (Container Management)

Portainer provides a web UI for managing Docker containers.

1. Go to **Actions** tab
2. Select **"Deploy Portainer"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
   - `portainer_password`: your-portainer-admin-password
5. Click **Run workflow**

Portainer will be available at `http://your-vps-ip:9000`

### Step 5.4: Deploy Nginx Proxy Manager (Staging)

Nginx Proxy Manager handles reverse proxy and SSL certificates.

The `docker-compose.stage.yml` includes Nginx Proxy Manager on ports 80/81/443.

To deploy Nginx Proxy Manager:

1. SSH into your VPS:

```bash
ssh -i ~/.ssh/vps_deploy root@your-vps-ip
```

2. Navigate to the project directory:

```bash
cd /opt/monorepo-template
```

3. Run the staging compose:

```bash
docker compose -f docker-compose.stage.yml up -d nginx-proxy-manager
```

4. Nginx Proxy Manager will be available at:
   - HTTP: `http://your-vps-ip:81`
   - HTTPS: `https://your-vps-ip:443`

Default login credentials:
- Email: `admin@example.com`
- Password: `changeme`

---

## Part 6: Deploy Applications

### Step 6.1: Create Database and User

**Create database:**

1. Go to **Actions** tab
2. Select **"Create Project DB"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `db_host`: your VPS IP address
   - `db_port`: `5432` (or `5433` for production)
   - `db_name`: your-project-database-name
   - `db_user`: your-database-user
   - `db_password`: your-database-password
5. Click **Run workflow**

**Create database user:**

1. Go to **Actions** tab
2. Select **"Create DB User"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `db_host`: your VPS IP address
   - `db_port`: `5432`
   - `db_user`: your-database-user
   - `db_password`: your-database-password
   - `db_name`: your-project-database-name
5. Click **Run workflow**

### Step 6.2: Deploy API

1. Go to **Actions** tab
2. Select **"Deploy API"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
   - `environment`: `staging`
   - `api_image_name`: your-api-image-name (e.g., `api`)
5. Click **Run workflow**

**For production:**

1. Go to **Actions** tab
2. Select **"Deploy API"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
   - `environment`: `production`
   - `api_db_url`: `postgresql://user:pass@localhost:5433/dbname`
   - `api_image_name`: your-api-image-name
5. Click **Run workflow**

API will be available at `http://your-vps-ip:3000`

### Step 6.3: Deploy Admin Portal

1. Go to **Actions** tab
2. Select **"Deploy Admin"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
   - `environment`: `staging`
5. Click **Run workflow**

Admin portal will be available at `http://your-vps-ip:3001`

### Step 6.4: Deploy Website

1. Go to **Actions** tab
2. Select **"Deploy Website"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
   - `environment`: `staging`
5. Click **Run workflow**

Website will be available at `http://your-vps-ip:3002` (or configured port)

---

## Workflow Reference

### Infrastructure Workflows

| Workflow | Purpose | Key Inputs |
|----------|---------|------------|
| `install_docker_on_vps.yml` | Install Docker on fresh VPS | `vps_host`, `vps_user` |
| `add-swap-memory.yml` | Add swap to VPS | `vps_host`, `vps_user`, `swap_size` |
| `setup_infra_network.yml` | Create Docker networks | `vps_host`, `vps_user` |
| `deploy-postgres.yml` | Deploy PostgreSQL | `vps_host`, `vps_user`, `db_password`, `environment` |
| `deploy-portainer.yml` | Deploy Portainer | `vps_host`, `vps_user`, `portainer_password` |

### Database Workflows

| Workflow | Purpose |
|----------|---------|
| `create-project-db.yml` | Create a new database |
| `create-db-user.yml` | Create a database user |
| `delete-project-db.yml` | Delete a database |
| `update-db-user-permissions.yaml` | Update user permissions |
| `db-migrate.yml` | Run database migrations |
| `db-seed.yml` | Seed the database |
| `backup_postgres_database.yml` | Backup PostgreSQL to S3 |
| `scheduled_backup_postgres.yml` | Automated daily backups |

### Deployment Workflows

| Workflow | Purpose | Key Inputs |
|----------|---------|------------|
| `deploy-api.yml` | Deploy Node.js API | `vps_host`, `vps_user`, `environment` |
| `deploy-admin.yml` | Deploy Admin Portal | `vps_host`, `vps_user`, `environment` |
| `deploy-website.yml` | Deploy Next.js Website | `vps_host`, `vps_user`, `environment` |

### Maintenance Workflows

| Workflow | Purpose |
|----------|---------|
| `restart_all_container.yml` | Restart all Docker containers |
| `check-disk-usage.yml` | Check VPS disk usage |
| `check_container_networks.yml` | Verify network connectivity |
| `cleanup-caches.yml` | Clean up CI/CD caches |

---

## Docker Compose Files Reference

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Development environment |
| `docker-compose.stage.yml` | Staging infrastructure |
| `docker-compose.production.yml` | Production infrastructure |
| `docker-compose.api.yml` | API service template |
| `docker-compose.admin.yml` | Admin portal template |
| `docker-compose.website.yml` | Website template |
| `docker-compose.api.production.yml` | API production with logging |
| `docker-compose.admin.production.yml` | Admin production config |
| `docker-compose.website.production.yml` | Website production config |

---

## Port Reference

| Service | Staging Port | Production Port |
|---------|--------------|------------------|
| API | 3000 | 3000 |
| Admin Portal | 3001 | 3001 |
| Website | 3002 | 3002 |
| PostgreSQL | 5432 | 5433 |
| Portainer | 9000 | 9000 |
| Nginx Proxy Manager | 80, 81, 443 | - |

---

## Environment Files Location on VPS

When deployed, the application files are located at:

```
/opt/monorepo-template/
├── docker-compose.yml
├── apps/
│   ├── api/
│   ├── admin-portal/
│   └── website/
├── packages/
└── ...
```

Environment files are stored in:

```
/opt/monorepo-template/
├── .env.api.staging
├── .env.api.production
├── .env.admin.staging
├── .env.admin.production
├── .env.website.staging
└── .env.website.production
```

---

## Troubleshooting

### SSH Connection Fails

1. Verify the private key is correctly added to GitHub Secrets
2. Ensure the public key was properly added to VPS (`~/.ssh/authorized_keys`)
3. Check that `VPS_HOST` and `VPS_USER` secrets are correct

### Container Not Starting

1. SSH into VPS: `ssh -i ~/.ssh/vps_deploy user@vps-host`
2. Check container logs: `docker logs <container_name>`
3. Check container status: `docker ps -a`
4. Verify network exists: `docker network ls`

### Database Connection Fails

1. Verify PostgreSQL is running: `docker ps | grep postgres`
2. Check logs: `docker logs postgres`
3. Verify port is accessible: `telnet vps-ip 5432`
4. Check connection string format in `API_DB_URL`

### Image Pull Fails (GHCR)

1. Ensure GitHub Packages access is enabled
2. Verify `GHCR_LOGIN` secret is set (automatic in deploy workflows)
3. Check that the image was successfully built and pushed

### Need to Restart All Services

1. Go to **Actions** tab
2. Select **"Restart All Container"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
5. Click **Run workflow**

### Check Disk Usage

1. Go to **Actions** tab
2. Select **"Check Disk Usage"** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - `vps_host`: your VPS IP address
   - `vps_user`: `root`
5. Click **Run workflow**

---

## Quick Start Summary

1. **Clone project to VPS** - `git clone` the repository to `/opt/monorepo-template`
2. **Create GitHub repository** and update remote
3. **Push to GitHub** - `git push -u origin main`
4. **Generate GitHub Personal Access Token** for GHCR access
5. **Generate SSH key** on local machine
6. **Copy public key** to VPS
7. **Add secrets** to GitHub: `VPS_SSH_KEY`, `VPS_HOST`, `VPS_USER`
8. **Install Docker** on VPS via GitHub Actions
9. **Create networks** via GitHub Actions
10. **Deploy PostgreSQL** via GitHub Actions
11. **Deploy Portainer** via GitHub Actions (optional but recommended)
12. **Deploy API** via GitHub Actions
13. **Deploy Admin Portal** via GitHub Actions
14. **Deploy Website** via GitHub Actions
