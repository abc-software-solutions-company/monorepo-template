import * as fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import sharp from 'sharp';
import { MigrationInterface, QueryRunner } from 'typeorm';
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

export class InitSeeds1689265344543 implements MigrationInterface {
  private s3Client: S3Client;

  constructor() {
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

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(User).save(userFactory);
    await queryRunner.manager.getRepository(Category).save(categoryFactory);
    await queryRunner.manager.getRepository(File).save(fileFactory);
    await queryRunner.manager.getRepository(Post).save(postFactory);
    await queryRunner.manager.getRepository(Product).save(productFactory);
    await queryRunner.manager.getRepository(Faq).save(faqFactory);
    await queryRunner.manager.getRepository(Contact).save(contactFactory);

    removeDirectory(FILE_ROOT_PATH);
    createDirectory(FILE_ROOT_PATH);
    createDirectory(THUMBNAIL_PATH);

    await this.createS3Bucket();
    await this.copyAssets();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(contactFactory.map(async (x: Contact) => await queryRunner.manager.getRepository(Contact).remove(x)));
    await Promise.all(faqFactory.map(async (x: Faq) => await queryRunner.manager.getRepository(Faq).remove(x)));
    await Promise.all(productFactory.map(async (x: Product) => await queryRunner.manager.getRepository(Product).remove(x)));
    await Promise.all(postFactory.map(async (x: Post) => await queryRunner.manager.getRepository(Post).remove(x)));
    await Promise.all(fileFactory.map(async (x: File) => await queryRunner.manager.getRepository(File).remove(x)));
    await Promise.all(categoryFactory.map(async (x: Category) => await queryRunner.manager.getRepository(Category).remove(x)));
    await Promise.all(userFactory.map(async (x: User) => await queryRunner.manager.getRepository(User).remove(x)));
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

      // Copy file to local storage
      // copyFile(file, path.join(FILE_ROOT_PATH, filename));
      // createThumbnail(file, filename);

      // Upload to Minio
      const fileContent: Buffer = fs.readFileSync(file);

      const command = new PutObjectCommand({ Bucket: process.env.AP_AWS_S3_BUCKET_NAME, Key: filename, Body: fileContent });

      await this.s3Client.send(command);

      const thumb = sharp(fileContent).resize(THUMBNAIL_WIDTH, null, { fit: 'contain' });

      const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.AP_AWS_S3_BUCKET_NAME,
        Key: `thumbnails/${filename}`,
        Body: (await thumb.toBuffer()).buffer as Buffer,
      });

      await this.s3Client.send(commandThumbnail);
    }
  }
}
