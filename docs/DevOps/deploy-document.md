# Hướng Dẫn Deploy Website Lên Server

## Bước 1: Kết nối đến server

Bạn cần có thông tin để kết nối đến server, bao gồm:

- Địa chỉ IP của server
- Tên đăng nhập
- Mật khẩu (một số server khác sẽ sử dụng key đăng nhập)

Thông tin của server Vietnix nằm ở file
[ABC Vietnix Server](https://abcdigitalio.sharepoint.com/:w:/s/ABCdigital/EaJ5fqwnSyxAqoyhtGHi3QEB3eC53SoQ8DChX2fPpDP5Kw?e=c7qYvw)

Thông tin của server AWS LightSail (1GB RAM) nằm ở folder
[AWS LightSail](https://abcdigitalio.sharepoint.com/:f:/s/ABCdigital/Emw7rpLOQRlCogp3yKOgYakByKODvEcgb5EalpFenSY-ZQ?e=ZRzoWy)

### Đăng nhập vào server

### Đăng nhập vào server bằng password

```bash
ssh <tên đăng nhập server>@<địa chỉ ip server>
```

Nhập password và nhấn Enter để đăng nhập.

### Đăng nhập vào server bằng SSH key

- Lưu key `.pem` vào máy (thường ở folder `~/.ssh/`)
- Cấp quyền cho key:

```bash
chmod 400 ~/.ssh/<tên-key>.pem
```

- Đăng nhập bằng key:

```bash
ssh -i ~/.ssh/<tên-key>.pem <tên đăng nhập server>@<địa chỉ ip server>
```

## Bước 2: Cài đặt Docker và Nginx Proxy Manager (Thường áp dụng lần đầu cho server mới mua hoặc server khách hàng mua cho production)

### Kiểm tra xem Docker đã được cài đặt chưa:

```bash
docker ps -a
```

Nếu lệnh chạy được và hiển thị danh sách các Docker Container có container Nginx Proxy Manager là server đã được setup sẵn

### Nếu chưa cài Docker và Nginx Proxy Manager, chạy các lệnh sau:

```bash
# Cài đặt Docker
curl -fsSL https://get.docker.com/ | sudo sh
sudo usermod -aG docker $USER

# Cài đặt Nginx Proxy Manager
mkdir ~/nginx-proxy-manager && cd ~/nginx-proxy-manager

docker run -d \
   --name nginx-proxy-manager \
   --restart unless-stopped \
   -p 80:80 \
   -p 81:81 \
   -p 443:443 \
   -v $(pwd)/data:/data \
   -v $(pwd)/letsencrypt:/etc/letsencrypt \
   -e INITIAL_ADMIN_EMAIL=admin@abcdigital.io \
   -e INITIAL_ADMIN_PASSWORD=ABCNginx@2025 \
   jc21/nginx-proxy-manager:latest
```

### Kiểm tra Nginx Proxy Manager

Mở trình duyệt Chrome và truy cập: `http:<địa chỉ ip server>:81`

Đăng nhập với:

- Email: `admin@abcdigital.io`
- Password: `ABCNginx@2025`

## Bước 3: Cấu hình Github Action

Vào folder `.github/workflows`. Bạn sẽ thấy có ba file tương ứng với 3 Project (website, api và admin portal). Đây là những file cấu hình cho Github
Action để tự động deploy.

### Thiết lập Secrets cho Github Action

- Vào trang settings của Github Repository
- Tại section "Secrets and variables" ở bên trái, chọn "Actions"
- Chọn "New repository secret" để thêm secret variable mới

### Các secret key cần thiết cho kết nối đến server để deploy và lưu các file .env:

#### Môi trường Stage:

- `STAGE_SERVER_HOST`
- `STAGE_SERVER_USER_NAME`
- `STAGE_SERVER_PASSWORD` # Dùng ở hầu hết các server Việt Nam.
- `STAGE_SERVER_KEY` # Dùng ở tất cả các server của AWS EC2 hoặc AWS LightSail

Đối với `STAGE_SERVER_PASSWORD` và `STAGE_SERVER_KEY` chỉ được dùng 1 trong 2 loại password hoặc key file để setup Github Action workflow

#### Môi trường Production:

- `PROD_SERVER_HOST`
- `PROD_SERVER_USER_NAME`
- `PROD_SERVER_PASSWORD`

- `PROD_SERVER_PASSWORD` # Dùng ở hầu hết các server Việt Nam.
- `PROD_SERVER_KEY` # Dùng ở tất cả các server của AWS EC2 hoặc AWS LightSail

Đối với `PROD_SERVER_PASSWORD` và `PROD_SERVER_KEY` chỉ được dùng 1 trong 2 loại password hoặc key file để setup Github Action workflow

#### File .env cho các service:

- `WEBSITE_STAGE`
- `API_STAGE`
- `PORTAL_STAGE`

#### Hoặc với môi trường Production:

- `WEBSITE_PROD`
- `API_PROD`
- `PORTAL_PROD`

## Bước 4: Thiết lập secret key cho AWS ECR và cấu hình AWS ECR

### Tạo AWS ECR Repository

Tài khoản [AWS Console](https://abcdigitalio.sharepoint.com/:x:/s/ABCdigital/ETDVKEGQ1ppCqi4p_kkgY1oBIQSd5skDGXTerOYwCENLaA?e=fgBFwx) được lưu ở
Sharepoint tại folder **AWS Console Account (S3, Email Service and ECR)**.

- Truy cập vào AWS Console
- Tìm kiếm "ECR" và chọn "Elastic Container Registry"
- Chọn "Private Registry" và nhấn "Create repository"
- Select "Private registry" and click "Create repository"
- Tại mục Repository name, nhập theo format:
  ```
  <tên project>-<tên của service "api"|"website"|"portal">-<môi trường "stage"|"preprod"|"prod">
  ```

<img src="https://abc-australia-stage.s3.ap-southeast-1.amazonaws.com/Screenshot+2025-03-25+at+9.22.49%E2%80%AFAM.png" width="100%">

- Nhấn "Create" để tạo ECR

### Thêm URI vào Github Secrets

- Tại trang Private repositories, tìm kiếm tên project

- Copy URI và thêm vào các secret với tên:
  - `AWS_ECR_REPOSITORY_URI_ADMIN_PORTAL_STAGE`
  - `AWS_ECR_REPOSITORY_URI_API_STAGE`
  - `AWS_ECR_REPOSITORY_URI_WEBSITE_STAGE`

### AWS Credentials

Thêm hai secret:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Lấy thông tin từ thư mục
[AWS ECR Credentials](https://abcdigitalio.sharepoint.com/:t:/s/ABCdigital/EZ2bKRaLvQZHp2fPskh8lYoBfcGF431ARO3Z8iZ0DJLgeg?e=PSvGIu).

## Bước 5: Cấu hình tên project

Trong mỗi file yml ở thư mục `.github/workflows`, rename `monorepo-template` thành tên project hiện tại.

## Bước 6: Deploy Backend API

### Chuẩn bị thông tin database

Lấy thông tin database từ thư mục sharepoint
[AWS Database](https://abcdigitalio.sharepoint.com/:t:/s/ABCdigital/EWO7-wKZ_UhCqZ1rXOLxP4sB_i9LEP6Wy8lnbiBvhsPPow?e=bfU0bC) và thêm vào file `.env`
của API.

### Thiết lập AWS S3

- Lấy thông tin credentials AWS S3 từ thư mục
  [AWS S3 Credentials](https://abcdigitalio.sharepoint.com/:t:/s/ABCdigital/EfCqvYb1zu5OpdNKArJ38t0B5h4g_LnAxJFLg51BAfltRA?e=ADwpgR)
- Tạo bucket mới tại AWS Console:

  - Search "S3" và click vào S3

   <img src="https://github.com/user-attachments/assets/d4feef47-0b51-4289-b150-71d2827a85cd" width="100%">

  - Kiểm tra khu vực là Singapore

   <img src="https://github.com/user-attachments/assets/640b52c4-7db6-465e-a15a-e1cdf895882d" width="100%">

  - Nhấn "Create bucket"
  - Nhập tên bucket
  - Bỏ chọn "Block all public access"
  - Tích "I acknowledge that the current settings might result in this bucket and the objects within becoming public"
  - Nhấn "Create Bucket"

### Cấu hình quyền cho S3 Bucket

- Vào trang chi tiết của S3 bucket vừa tạo
- Vào tab "Permissions" của bucket
- Kéo xuống "Bucket policy" và nhấn "Edit"
- Sử dụng mẫu JSON sau (thay `project-name-stage` bằng tên bucket):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::project-name-stage/*"
    }
  ]
}
```

- Nhấn "Save changes"

<img src="https://github.com/user-attachments/assets/b59e7e36-ba76-4de4-bcb5-f4fdbc57e567" width="100%">

### Cấu hình CORS cho S3 Bucket

- Vào tab "Permissions"
- Kéo xuống "Cross-origin resource sharing (CORS)"
- Nhấn "Edit" và nhập JSON:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["HEAD", "GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

- Nhấn "Save changes"

<img src="https://github.com/user-attachments/assets/602aa67b-55b2-4020-a66b-7d1d0fb998c1" width="100%">

### Thiết lập Email SMTP

- Lấy thông tin SMTP từ file
  [AWS Email SMTP Credentials](https://abcdigitalio.sharepoint.com/:t:/s/ABCdigital/Eaca3BONWidAt-lIM4a_dNoB4S1yz2MGUz-PpvHMh30Teg?e=JYNnPM)
- Thêm vào file `.env` của API

### Đăng ký Email Sender trên AWS SES

- Tại AWS Console, tìm "SES" và chọn "Amazon Simple Email Service"

<img src="https://github.com/user-attachments/assets/6c6c7fce-aeef-4af6-b020-5b99da2468d8" width="100%">

- Chọn "Identities" trong mục "Configuration"
- Nhấn "Create identity"

<img src="https://github.com/user-attachments/assets/a2c1f72d-41ce-43c3-a042-2f73c12c55e7" width="100%">

- Chọn "Email address" và nhập email

<img src="https://github.com/user-attachments/assets/8aaf1921-fbf4-461f-80ed-ae5c59739aa3" width="100%">

- Xác thực email từ link AWS gửi về email mà bạn đăng ký Xác thực thành công, email sẽ có trạng thái Verified

<img src="https://github.com/user-attachments/assets/473196cf-893c-429b-b325-bc4950b95df7" width="100%">

- Sau khi xác thực, thêm email vào biến môi trường `AP_EMAIL_SENDER`

## Bước 7: Chuẩn bị deploy API

### Kiểm tra port

- `APP_PORT` mặc định của API là 3500 (để đổi port hãy sửa biến `AP_PORT` trong file `.env` và `APP_PORT` trong `api.stage.yml`)
- Kiểm tra `SERVER_PORT` và `APP_PORT` của api trong file `.github/workflows/api.stage.yml`

### Kiểm tra port đã được sử dụng

- Vào trang Nginx Proxy Manager (thông tin đăng nhập tại
  [ABC Vietnix Server Nginx Proxy Manager Account Dashboard.docx](https://abcdigitalio.sharepoint.com/:w:/s/ABCdigital/EaJ5fqwnSyxAqoyhtGHi3QEB3eC53SoQ8DChX2fPpDP5Kw?e=5spfEl))
- Click vào "Proxy Hosts"

- Kiểm tra các port đã được sử dụng trong cột "Destination"

### Deploy

Tạo pull request cho nhánh main, review pull request và merge vào nhánh main để tiến hành deploy.

## Bước 8: Cấu hình tên miền cho API

Ví dụ: API URL là `http://14.225.253.84:3590/api/v1`

### Cấu hình Proxy cho tên miền

- Vào trang Nginx Proxy Manager
- Nhấn "Add Proxy Host"
- Điền thông tin:
  - Domain Names: `stage.api.project-name.abcdigital.io`
  - Scheme: `http`
  - Forward Hostname / IP: IP server (ví dụ: `14.225.253.84`)
  - Forward Port: Server Port (ví dụ: `3590`)
- Nhấn "Save"

<img src="https://github.com/user-attachments/assets/3f107fa2-592e-402e-b3d1-8a14e46dcc4d" width="100%">

### Cấu hình DNS Record

- Vào trang Namecheap, chọn "Domain List"
- Click "Manage" cho tên miền mình cần thêm subdomain (ví dụ: `abcdigital.io`)
- Chọn tab "Advanced DNS"
- Chọn "ADD NEW RECORD" và chọn "A Record"
- Phần Host nhập: `stage.api.project-name`
- Phần Value: IP của server (ví dụ: `14.225.253.84`)
- Nhấn dấu tích xanh để lưu

   <img src="https://github.com/user-attachments/assets/a3fe219c-a460-4e06-aae2-6afa94114d84" width="100%">

### Cấu hình HTTPS

- Tại Nginx Proxy Manager, vào "Proxy Hosts"
- Click vào dấu ba chấm dọc và chọn "Edit" cho tên miền

<img src="https://github.com/user-attachments/assets/5ce9dca5-801e-425a-a90a-6322111fa735" width="100%">

- Vào tab "SSL"
- Chọn "Request a new SSL Certificate"

<img src="https://github.com/user-attachments/assets/9c196bdc-b248-4293-aa90-43c774f67761" width="100%">

- Bật "Force SSL" và "HTTP/2 Support"
- Nhập email để nhận thông báo về chứng chỉ SSL
- Tích "I Agree to the Let's Encrypt Terms of Service"
- Nhấn "Save"

   <img src="https://github.com/user-attachments/assets/1f96ab0c-7e1d-4559-a241-1f0da0162aa8" width="100%">

## Bước 9: Deploy Website và Admin Portal

- `APP_PORT` của website trong file `.github/workflows/website.stage.yml` luôn là 3000. Để thay đổi APP_PORT cho docker website, hãy sửa ENV PORT
  <port> trong Dockerfile của folder website
- `APP_PORT` của Admin Portal được cấu hình trong file `.github/workflows/admin-portal.stage.yml` và lệnh `yarn preview`

Các bước deploy còn lại đều tương tự như khi setup deploy API.
