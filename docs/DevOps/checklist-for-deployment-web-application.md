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
  [Reference document](../DevOps/01-setup-ubuntu-server.md) for setup PostgreSQL on new server

---

## 4. **Server Setup**

- Install Docker to manage containerized applications.
- Set up Nginx Proxy Manager to handle reverse proxying, making it easier to manage domains and SSL configurations.
- [Reference document](../DevOps/01-setup-ubuntu-server.md) for setup Nginx Proxy Manager on new server

---

## 5. **SEO and Metadata Setup**

- Update the constants file with essential website information. Modify data in file `apps/website/src/constants/site.constant.ts`:
  - Update `WEBSITE_URL` with your production URL
  - Set `WEBSITE_NAME` to your site's name
  - Write a descriptive `WEBSITE_DESCRIPTION` for SEO
  - Add relevant `WEBSITE_KEYWORD` tags
  - Change `WEBSITE_SLOGAN` to match your brand
  - Update `WEBSITE_OG_IMAGE` path
  - Set `COMPANY_NAME`, `COMPANY_URL`, and `COMPANY_EMAIL`
  - Configure `COMPANY_SOCIAL` links
  - Update `COMPANY_PRODUCTS` array
- Update the Open Graph image for social media sharing:
  - Replace the default image at `/apps/website/public/og-img.jpg` with your custom image
  - Recommended size: 1200x630 pixels for optimal display on Facebook and other platforms
  - Image should be visually appealing and represent your brand/content
  - Keep file size under 1MB for faster loading
  - Use JPG format for better compression while maintaining quality

---

## 6. **Domain Setup**

- Point the main domain and subdomains (e.g., `api`, `www`, `portal`) to the server's IP address for proper routing.
- [Reference document](../DevOps/03-setup-domain-and-proxy.md) for setup domain

---

## 7. **Email Service Setup**

- Prepare email configurations using AWS SNS, including:
  - Setting up email sender and receiver accounts.
  - Registering the email sender in AWS SNS to verify its identity.
- Configure email service environment variables for backend:
  - Set `AP_EMAIL_HOST` to your SMTP server host
  - Configure `AP_EMAIL_PORT` (default 587 for TLS)
  - Set `AP_EMAIL_SECURE` to true/false based on your email provider's requirements
  - Add `AP_EMAIL_USERNAME` for authentication
  - Set `AP_EMAIL_PASSWORD` for authentication
- Test email configuration by sending a test email through the system

---

## 8. **File Storage Setup**

- Create an AWS S3 bucket to store and manage files in AWS
- Configure AWS S3 environment variables for backend:
  - Set `AP_AWS_ENDPOINT` to your S3 endpoint URL
  - Configure `AP_AWS_REGION` for your bucket region
  - Add `AP_AWS_ACCESS_KEY_ID` from your IAM credentials
  - Set `AP_AWS_SECRET_ACCESS_KEY` from your IAM credentials
  - Configure `AP_AWS_S3_BUCKET_NAME` with your bucket name
- Test file upload functionality through the admin portal to verify S3 configuration

---

## 9. **Database Migration and Seeding**

- Prepare initial data for the admin portal, including a default admin user account.
- Configure default admin user credentials in environment variables:

  - Set `AP_USER_EMAIL` to your admin email (e.g., admin@example.com)
  - Set `AP_USER_PASSWORD` to a strong password that includes:
    - At least 8 characters
    - At least one uppercase letter (A-Z)
    - At least one lowercase letter (a-z)
    - At least one number (0-9)
    - At least one special character (!@#$%^&\*) Example format: `MyP@ssw0rd123`

- Run database migrations and seed the prepared data to initialize the system:

---

## 10. **CORS Configuration**

- Set up Cross-Origin Resource Sharing (CORS) policies on the backend to allow safe interactions with the admin portal and website.
- Configure CORS environment variables for backend:
  - Set `AP_ALLOW_WEB_APP_ORIGIN` to your web application URL (e.g., https://example.com)
  - Set `AP_ALLOW_ADMIN_PORTAL_ORIGIN` to your admin portal URL (e.g., https://portal.example.com)
- Test CORS configuration by:
  - Making API requests from both the web application and admin portal
  - Verifying that requests are properly handled with correct CORS headers
  - Checking browser console for any CORS-related errors

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
  1. Go to Google Search Console (https://search.google.com/search-console)
  2. Click "Add Property" and choose property type:
     - Domain property (recommended): Enter your root domain (e.g., example.com)
     - URL-prefix property: Enter full URL (e.g., https://www.example.com)
  3. Verify website ownership:
     - For Domain property: a. Get the TXT record from Google Search Console b. Add the TXT record to your domain's DNS settings c. Wait for DNS
       propagation (can take up to 72 hours) d. Click "Verify" in Search Console
     - For URL-prefix property, choose one method: a. HTML file: Download Google's HTML file and upload to your root directory b. HTML tag: Add the
       meta tag to your website's <head> section c. DNS record: Add the provided TXT record to your DNS settings d. Google Analytics: Link your
       existing GA account
  4. Submit and verify sitemap:
     - Go to "Sitemaps" section in left sidebar
     - Enter your sitemap URL (typically sitemap.xml)
     - Click "Submit"
     - Check status after submission
  5. Configure settings:
     - Set preferred domain version (www vs non-www)
     - Select target country if applicable
     - Link Google Analytics account
  6. Set up monitoring:
     - Enable email notifications in Settings > Messages
     - Configure notification types:
       - Critical issues
       - Security issues
       - Site performance updates
       - New coverage issues
  7. Regular maintenance:
     - Monitor Coverage report for indexing issues
     - Check Performance report for search analytics
     - Review Mobile Usability report
     - Address any security or manual actions promptly

---

### Notes:

- Ensure each step is completed before moving to the next.
- Test thoroughly after deployment to confirm everything is functioning as expected.
