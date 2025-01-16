# Monorepo Deployment Checklist

This checklist is designed to guide team members, developers, and support staff through the process of deploying a web application in a monorepo
setup. Follow each step carefully to ensure a smooth deployment.

---

## 1. **Prepare Server Access**

- Gather the required information for SSH connection, including IP address, username, password, and SSH key.
- Use this information to set up secret environment variables in GitHub Actions. The variables should include server host details, username, password,
  and the key for secure access.

### For Staging Environment

1. Navigate to your GitHub repository.
2. Go to **Settings → Secrets and variables → Actions**.
3. Click on **New repository secret**.
4. Add the following secrets:

   - **`STAGE_SERVER_HOST`**: Hostname or IP address of your staging server.
   - **`STAGE_SERVER_USER_NAME`**: SSH username for the staging server.
   - **`STAGE_SERVER_PASSWORD`**: SSH password for the staging server.
   - **`PORTAL_STAGE`**, **`API_STAGE`**, **`WEBSITE_STAGE`**: Environment variables for each application.

### For Production Environment

1. Navigate to your GitHub repository.
2. Go to **Settings → Secrets and variables → Actions**.
3. Click on **New repository secret**.
4. Add the following secrets:

   - **`PROD_SERVER_HOST`**: Hostname or IP address of your production server.
   - **`PROD_SERVER_USER_NAME`**: SSH username for the production server.
   - **`PROD_SERVER_PASSWORD`**: SSH password for the production server.
   - **`PORTAL_PROD`**, **`API_PROD`**, **`WEBSITE_PROD`**: Environment variables for each application.

---

## 2. **Update Docker Configuration In Github Action Workflows**

### Docker Configuration Updates

Before modifying the GitHub Actions workflows in `.github/workflows`, follow these steps:

1. **Check Available Ports**

   - Run **`docker ps`** on your server to see which ports are already in use
   - Choose an available port for the **`DOCKER_HOST_PORT`** setting

2. **Update Service Names**

   - Change **`APP_NAME`** to a unique identifier for your application
   - Update **`DOCKER_COMPOSE_SERVICE`** to match your service name

3. **Required Changes** The following variables **must** be updated in each workflow file:
   - **`DOCKER_HOST_PORT`**: The port your container will use on the host machine
   - **`APP_NAME`**: The name of your Docker container/application
   - **`DOCKER_COMPOSE_SERVICE`**: The service name in your docker-compose file

---

## 3. **Set Up Databases**

- Configure PostgreSQL databases for both staging and production environments, ensuring secure connections and proper configurations.

---

## 4. **Server Setup**

- Install Docker to manage containerized applications.
- Set up Nginx Proxy Manager to handle reverse proxying, making it easier to manage domains and SSL configurations.

---

## 5. **SEO and Metadata Setup**

- Update the constants file with essential website information, including:
  - The website URL and name.
  - A description and keywords for search engine optimization.
  - A slogan to represent the site.
  - The URL for the Open Graph image (used for social media previews).
- Include details about the company, such as its name, URL, email, and social media links.

---

## 6. **Domain Setup**

- Point the main domain and subdomains (e.g., `api`, `www`, `portal`) to the server's IP address for proper routing.

---

## 7. **Email Service Setup**

- Prepare email configurations using AWS SNS, including:
  - Setting up email sender and receiver accounts.
  - Registering the email sender in AWS SNS to verify its identity.

---

## 8. **File Storage Setup**

- Create an AWS S3 bucket to store and manage files.
- Configure AWS S3 IAM credentials to allow the admin portal to upload and manage files through the backend.

---

## 9. **Database Migration and Seeding**

- Prepare initial data for the admin portal, including a default admin user account.
- Run database migrations and seed the prepared data to initialize the system.

---

## 10. **CORS Configuration**

- Set up Cross-Origin Resource Sharing (CORS) policies on the backend to allow safe interactions with the admin portal and website.

---

## 11. **Backend Environment Variables**

- Define all required environment variables for the backend, including:
  - Database connection details.
  - AWS S3 credentials for file storage.
  - Default admin user credentials.

---

## 12. **Frontend Preparation**

- Ensure the constants file includes all necessary website details, such as the URL, name, description, and Open Graph image.
- Generate and include favicons for different devices and platforms.
- Create and add image thumbnails to improve the user experience.

---

## 13. **Google Search Console Setup**

- Add the website to Google Search Console for search performance monitoring:
  - Verify website ownership using one of the provided methods (HTML file, DNS record, or HTML meta tag).
  - Submit the sitemap.xml to help Google understand the website structure.
  - Monitor for any crawling issues or manual actions.
  - Set up email notifications for critical issues.
  - Configure geographic targeting if the website is region-specific.

---

### Notes:

- Ensure each step is completed before moving to the next.
- Test thoroughly after deployment to confirm everything is functioning as expected.
