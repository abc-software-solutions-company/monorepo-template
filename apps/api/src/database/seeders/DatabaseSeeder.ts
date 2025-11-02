import * as fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import sharp from 'sharp';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BucketCannedACL, CreateBucketCommand, PutBucketPolicyCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

import { Category } from '@/modules/categories/entities/category.entity';
import { Contact } from '@/modules/contacts/entities/contact.entity';
import { Faq } from '@/modules/faqs/entities/faq.entity';
import { FILE_ROOT_PATH, THUMBNAIL_PATH, THUMBNAIL_WIDTH } from '@/modules/files/constants/files.constant';
import { File } from '@/modules/files/entities/file.entity';
import { createDirectory, removeDirectory } from '@/modules/files/utils/file.util';
import { Post } from '@/modules/posts/entities/post.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';

import { categoryFactory } from '../factories/dev/category.factory';
import { contactFactory } from '../factories/dev/contact.factory';
import { faqFactory } from '../factories/dev/faq.factory';
import { fileFactory } from '../factories/dev/file.factory';
import { postFactory } from '../factories/dev/post.factory';
import { productFactory } from '../factories/dev/product.factory';
import { userFactory } from '../factories/user.factory';

export class DatabaseSeeder extends Seeder {
  private s3Client: S3Client;

  constructor() {
    super();
    const s3ClientConfig: S3ClientConfig = {
      region: process.env.AP_AWS_REGION,
      endpoint: process.env.AP_AWS_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AP_AWS_SECRET_ACCESS_KEY,
      },
    };

    this.s3Client = new S3Client(s3ClientConfig);
  }

  async run(em: EntityManager): Promise<void> {
    // Insert seed data
    const users = userFactory.map(data => em.create(User, data));

    await em.persistAndFlush(users);

    const categories = categoryFactory.map(data => em.create(Category, data));

    await em.persistAndFlush(categories);

    const files = fileFactory.map(data => em.create(File, data));

    await em.persistAndFlush(files);

    const posts = postFactory.map(data => em.create(Post, data));

    await em.persistAndFlush(posts);

    const products = productFactory.map(data => em.create(Product, data));

    await em.persistAndFlush(products);

    const faqs = faqFactory.map(data => em.create(Faq, data));

    await em.persistAndFlush(faqs);

    const contacts = contactFactory.map(data => em.create(Contact, data));

    await em.persistAndFlush(contacts);

    // Setup file directories
    removeDirectory(FILE_ROOT_PATH);
    createDirectory(FILE_ROOT_PATH);
    createDirectory(THUMBNAIL_PATH);

    // Setup S3 bucket and copy assets
    try {
      await this.createS3Bucket();
      await this.copyAssets();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Warning: Failed to setup S3 bucket or copy assets:', error.message);
      // eslint-disable-next-line no-console
      console.log('Database seeding completed, but S3 setup failed. You may need to configure S3/MinIO separately.');
    }
  }

  private async createS3Bucket() {
    // Create bucket
    try {
      const createBucketParams = {
        Bucket: process.env.AP_AWS_S3_BUCKET_NAME,
        ACL: BucketCannedACL.public_read,
      };

      await this.s3Client.send(new CreateBucketCommand(createBucketParams));

      // Add bucket policy
      const bucketPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${process.env.AP_AWS_S3_BUCKET_NAME}/*`,
          },
        ],
      };

      const policyParams = {
        Bucket: process.env.AP_AWS_S3_BUCKET_NAME,
        Policy: JSON.stringify(bucketPolicy),
      };

      await this.s3Client.send(new PutBucketPolicyCommand(policyParams));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Failed to create public bucket:', error.message);
    }
  }

  private async copyAssets() {
    const files = glob.sync(path.join(__dirname, '../factories/assets/*.*'));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = path.basename(file);

      // Upload to Minio
      const fileContent: Buffer = fs.readFileSync(file);

      const command = new PutObjectCommand({ Bucket: process.env.AP_AWS_S3_BUCKET_NAME, Key: filename, Body: fileContent });

      await this.s3Client.send(command);

      const thumb = sharp(fileContent).resize(THUMBNAIL_WIDTH, null, { fit: 'contain' });

      const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.AP_AWS_S3_BUCKET_NAME,
        Key: `thumbnails/${filename}`,
        Body: (await thumb.toBuffer()).buffer as unknown as Buffer,
      });

      await this.s3Client.send(commandThumbnail);
    }
  }
}
