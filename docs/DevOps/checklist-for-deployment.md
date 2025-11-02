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
   - Choose an available port for the **`SERVER_PORT`** setting

2. **Update Service Names**

   - Change **`APP_NAME`** to a unique identifier for your application
   - Update **`DOCKER_COMPOSE_SERVICE`** to match your service name

3. **Required Changes** The following variables **must** be updated in each workflow file:

   - **`SERVER_PORT`**: The port your container will use on the host machine
   - **`APP_NAME`**: The name of your Docker container/application
   - **`DOCKER_COMPOSE_SERVICE`**: The service name in your docker-compose file

4. **Configure Branch Deployment**

   For proper deployment control between environments:

   - **Staging Environment**:

     - Deploys from the `main` branch
     - Triggered on every push to `main`
     - Used for testing new features and changes
     - Example workflow trigger configuration:
       ```yaml
       on:
         push:
           branches:
             - 'main'
         workflow_dispatch:
       ```

   - **Production Environment**:
     - Deploys from the `release` branch
     - More controlled deployment process
     - Only deploys stable, tested code
     - Example workflow trigger configuration:
       ```yaml
       on:
         push:
           branches:
             - 'release'
         workflow_dispatch:
       ```

   This separation ensures that:

   - New features are properly tested in staging before production
   - Production deployments are intentional and controlled
   - Development team can continuously integrate to `main` without affecting production
   - Release process is clear and documented through branch management

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
- Configure environment variables for enable SEO in production:
  - Set `NEXT_PUBLIC_APP_ENV=production` in production environment only
  - This enables Google crawling and indexing of your website
  - Keep as `development` in staging/development environments
  - Example `.env` configuration for production:
    ```env
    NEXT_PUBLIC_APP_ENV=production
    ```
  - Example `.env` configuration for development/staging:
    ```env
    NEXT_PUBLIC_APP_ENV=development
    ```

---

## 6. **Domain Setup**

- Point the main domain and subdomains (e.g., `api`, `www`, `portal`) to the server's IP address for proper routing.
- [Reference document](../DevOps/03-setup-domain-and-proxy.md) for setup domain

---

# 7. **Email Service Setup**

## Setting Up Email Configuration with AWS SES

This guide provides a step-by-step process to configure email services using Amazon Simple Email Service (SES). It includes setting up email sender
and receiver accounts, registering the email sender in AWS SES, configuring environment variables for the backend, and testing the email
configuration.

---

### **Step 1: Set Up Email Sender and Receiver Accounts**

#### **1.1 Register the Email Sender in AWS SES**

1. Log in to the **AWS Management Console**.
2. Navigate to **Amazon SES** under the **Services** menu.
3. In the left-hand menu, select **Identities** under the **Configuration** section.
4. Click **Create Identity**.
5. In the **Identity details** section:
   - Choose **Email address** as the identity type.
   - Enter the email address you want to use as the sender.
6. Click **Create Identity**.
7. **AWS SES** will send a verification email to the provided email address. Open the email and click the verification link to confirm the email
   address.

---

### **Step 2: Create SMTP Credentials for Email Sending**

#### **2.1 Generate SMTP Credentials**

1. In the AWS SES console, go to the **SMTP Settings** tab.
2. Click **Create SMTP Credentials**.
3. Enter a **Username** for the SMTP credentials.
4. Review the permissions policy for the user group. Ensure it includes the following permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "ses:SendRawEmail",
         "Resource": "*"
       }
     ]
   }
   ```
5. Click **Create User**.
6. In the **Retrieve SMTP Credentials** step, download the `.csv` file containing the credentials. The file includes:
   - **IAM User Name**
   - **SMTP Username**
   - **SMTP Password**

---

### **Step 3: Configure Email Service Environment Variables for Backend**

Map the SMTP credentials and settings to your backend environment variables as follows:

```plaintext
# EMAIL CONFIGURATION
AP_EMAIL_HOST=email-smtp.<region>.amazonaws.com  # Replace <region> with your AWS region (e.g., us-east-1)
AP_EMAIL_PORT=587                                # Default port for TLS
AP_EMAIL_SECURE=false                            # Set to true if using SSL
AP_EMAIL_USERNAME=<SMTP Username>                # From the downloaded .csv file
AP_EMAIL_PASSWORD=<SMTP Password>                # From the downloaded .csv file
```

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
  - Database connection details:
    - `AP_DB_HOST`: Database host URL
    - `AP_DB_PORT`: Database port (default: 5432)
    - `AP_DB_USERNAME`: Database username
    - `AP_DB_PASSWORD`: Database password
    - `AP_DB_NAME`: Database name
  - AWS S3 credentials for file storage:
    - `AP_AWS_ENDPOINT`: S3 endpoint URL
    - `AP_AWS_REGION`: AWS region
    - `AP_AWS_ACCESS_KEY_ID`: AWS access key
    - `AP_AWS_SECRET_ACCESS_KEY`: AWS secret key
    - `AP_AWS_S3_BUCKET_NAME`: S3 bucket name
  - Default admin user credentials:
    - `AP_USER_EMAIL`: Admin email
    - `AP_USER_PASSWORD`: Admin password
  - Email configuration:
    - `AP_EMAIL_HOST`: SMTP host
    - `AP_EMAIL_PORT`: SMTP port
    - `AP_EMAIL_SECURE`: Use TLS/SSL
    - `AP_EMAIL_USERNAME`: SMTP username
    - `AP_EMAIL_PASSWORD`: SMTP password
  - CORS settings:
    - `AP_ALLOW_WEB_APP_ORIGIN`: Web app URL
    - `AP_ALLOW_ADMIN_PORTAL_ORIGIN`: Admin portal URL
  - Application settings:
    - `AP_PORT`: Backend server port
    - `AP_JWT_SECRET`: JWT signing secret
    - `AP_JWT_EXPIRES_IN`: JWT expiration time
    - `AP_THROTTLE_TTL`: Rate limit window (seconds)
    - `AP_THROTTLE_LIMIT`: Max requests per window
- Ensure all environment variables are properly set in deployment environment
- Consider using a .env file for local development and secure secrets management for production

---

## 12. **Frontend Preparation**

- Configure frontend environment variables based on .env.template:
  - Set `NEXT_PUBLIC_APP_ENV`: Application environment (development/staging/production)
  - Set `NEXT_PUBLIC_API_URL`: Backend API URL
  - Set `NEXT_PUBLIC_SITE_URL`: Frontend application URL
  - Configure authentication (If your application have function login with google, facebook)
    - `NEXTAUTH_URL`: Authentication callback URL
    - `NEXTAUTH_SECRET`: Secret key for NextAuth
    - `NEXTAUTH_EXPIRES_IN`: Session expiration time
    - `AUTH_FACEBOOK_ID` and `AUTH_FACEBOOK_SECRET`: Facebook OAuth credentials
    - `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: Google OAuth credentials
  - Set up tracking:
    - `NEXT_PUBLIC_GOOGLE_TRACKING`: Google Analytics tracking ID
    - `NEXT_PUBLIC_SEGMENT_TRACKING`: Segment tracking ID
  - Configure maps:
    - `NEXT_PUBLIC_GOONG_MAP_API_KEY`: Goong Maps API key
    - `NEXT_PUBLIC_GOOGLE_MAP_API_KEY`: Google Maps API key
  - Set up chat:
    - `NEXT_PUBLIC_MESSENGER_PAGE_ID`: Facebook Messenger page ID
- Ensure the constants file includes all necessary website details, such as the URL, name, description, and Open Graph image.
- Generate and include favicons for different devices and platforms.
- Create and add image thumbnails to improve the user experience.

---

## 13. **Sitemap Generation and Verification**

1. **Generate the Sitemap**

   - Ensure your Next.js application generates a sitemap dynamically or statically.
   - Use a library like [`next-sitemap`](https://github.com/iamvishnusankar/next-sitemap) or manually create a `sitemap.xml` file.

2. **Verify Sitemap Accessibility**

   - Ensure the sitemap is accessible at `https://yourwebsite.com/sitemap.xml`.
   - Test the sitemap URL in a browser or using a tool like `curl` to confirm it returns a valid XML file.

3. **Validate Sitemap Content**

   - Use a sitemap validator (e.g., [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)) to ensure the sitemap is
     correctly formatted and contains no broken links.
   - Confirm all important pages are included and no unnecessary pages are listed.

4. **Automate Sitemap Updates**

   - If your site has dynamic content, ensure the sitemap is regenerated and updated automatically whenever new content is added.
   - Integrate sitemap generation into your build or deployment pipeline.

5. **Check robots.txt**

   - Ensure the `robots.txt` file references the sitemap.
   - Example: `User-agent: \* Allow: / Sitemap: https://yourwebsite.com/sitemap.xml`

6. **Monitor Post-Deployment**

   - After deployment, verify the sitemap is still accessible and correctly updated.
   - Check search engine tools for any indexing issues related to the sitemap.

---

By including this checklist item, you ensure that your Next.js application's sitemap is properly generated, validated, and submitted, which is
essential for SEO and search engine visibility.

---

## 14. **Google Search Console Setup**

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

## 15. \*\*Remove domain prod testing"

- After setup production domain for customer website. We must remove internal or testing domain to prevent google index.

## 16. \*\*If website is under construction, only show under construction page, and not show other pages"

## 17. \*\*When point domain to new IP server, we must setup HTTPS for website work properly

## 18. \*\*Check robots.txt file and meta tag robots, google when deploy to stage must have disallow, noindex

### Notes:

- Ensure each step is completed before moving to the next.
- Test thoroughly after deployment to confirm everything is functioning as expected.

```

```
