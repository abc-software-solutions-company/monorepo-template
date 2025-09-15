#!/bin/bash

BUCKET_NAME="$1"
REGION="$2"

if [[ -z "$BUCKET_NAME" || -z "$REGION" ]]; then
  echo "Usage: create_s3.sh <bucket_name> <region>"
  echo "Example: create_s3.sh my-app-bucket ap-southeast-1"
  exit 1
fi

echo "Checking if bucket $BUCKET_NAME exists..."
BUCKET_EXISTS=$(aws s3api head-bucket --bucket "$BUCKET_NAME" 2>&1 || echo "error")

if [[ "$BUCKET_EXISTS" == *"error"* ]]; then
  echo "Creating S3 bucket $BUCKET_NAME in $REGION region..."
  
  # Create bucket with specified region
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --create-bucket-configuration LocationConstraint="$REGION" \
    --region "$REGION"
  
  if [ $? -eq 0 ]; then
    echo "Setting default bucket encryption..."
    # Enable default encryption with AES256
    aws s3api put-bucket-encryption \
      --bucket "$BUCKET_NAME" \
      --server-side-encryption-configuration '{
        "Rules": [
          {
            "ApplyServerSideEncryptionByDefault": {
              "SSEAlgorithm": "AES256"
            },
            "BucketKeyEnabled": true
          }
        ]
      }' \
      --region "$REGION"
    
    echo "Setting public access configuration to allow public access..."
    # Allow public access
    aws s3api put-public-access-block \
      --bucket "$BUCKET_NAME" \
      --public-access-block-configuration '{
        "BlockPublicAcls": false,
        "IgnorePublicAcls": false,
        "BlockPublicPolicy": false,
        "RestrictPublicBuckets": false
      }' \
      --region "$REGION"
    
    echo "Setting bucket policy to make all objects publicly readable..."
    # Create a policy file to make all objects in the bucket publicly readable
    POLICY='{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "PublicReadForGetBucketObjects",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
        }
      ]
    }'
    
    # Apply the bucket policy
    echo "$POLICY" | aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///dev/stdin
    
    echo "Setting CORS configuration to allow requests from localhost..."
    # Create CORS configuration to allow all methods from localhost
    CORS_CONFIG='{
      "CORSRules": [
        {
          "AllowedOrigins": ["http://localhost:*", "https://localhost:*"],
          "AllowedHeaders": ["*"],
          "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
          "MaxAgeSeconds": 3000,
          "ExposeHeaders": ["ETag"]
        }
      ]
    }'
    
    # Apply the CORS configuration
    echo "$CORS_CONFIG" | aws s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration file:///dev/stdin
    
    echo "S3 bucket $BUCKET_NAME created successfully with encryption, public read access, and CORS configuration for localhost."
    echo "Files uploaded to this bucket will be accessible at: https://$BUCKET_NAME.s3.$REGION.amazonaws.com/your-file-name"
  else
    echo "Failed to create S3 bucket $BUCKET_NAME."
    exit 1
  fi
else
  echo "S3 bucket $BUCKET_NAME already exists."
  
  echo "Updating bucket policy to make all objects publicly readable..."
  # Create a policy file to make all objects in the bucket publicly readable
  POLICY='{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadForGetBucketObjects",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
      }
    ]
  }'
  
  # Apply the bucket policy
  echo "$POLICY" | aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///dev/stdin
  
  echo "Setting CORS configuration to allow requests from localhost..."
  # Create CORS configuration to allow all methods from localhost
  CORS_CONFIG='{
    "CORSRules": [
      {
        "AllowedOrigins": ["http://localhost:*", "https://localhost:*"],
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "MaxAgeSeconds": 3000,
        "ExposeHeaders": ["ETag"]
      }
    ]
  }'
  
  # Apply the CORS configuration
  echo "$CORS_CONFIG" | aws s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration file:///dev/stdin
  
  echo "Bucket policy and CORS configuration updated. Files uploaded to this bucket will be accessible at: https://$BUCKET_NAME.s3.$REGION.amazonaws.com/your-file-name"
fi 