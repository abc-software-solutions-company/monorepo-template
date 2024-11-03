import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpStatusCode } from 'axios';
import { CopyObjectCommand, DeleteObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

import { IConfigs } from '@/common/interfaces/configs.interface';

import { PutObjectRequest } from './interfaces/aws.interface';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get<IConfigs['aws']>('aws');

    if (!awsConfig) {
      throw new Error('AWS configuration is not available');
    }

    const { region, endPoint, credentials, s3 } = awsConfig;

    if (!s3 || !s3.bucketName) {
      throw new Error('S3 configuration is missing');
    }

    this.bucketName = s3.bucketName;

    const s3ClientConfig: S3ClientConfig = {
      region,
      endpoint: endPoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    };

    this.s3Client = new S3Client(s3ClientConfig);
  }

  async putObject({ key, body }: PutObjectRequest): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
    });

    try {
      await this.s3Client.send(command);
    } catch (err) {
      throw new Error(`Failed to put object: ${err.message}`);
    }
  }

  async removeObject(objectKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (err) {
      throw new Error(`Failed to remove object: ${err.message}`);
    }
  }

  moveToTrashObject = async (objectKey: string) => {
    const moveObjectCommand = new CopyObjectCommand({
      CopySource: `${this.bucketName}/${objectKey}`,
      Bucket: this.bucketName,
      Key: `${'temp-upload'}/${objectKey}`,
    });

    const moveObjectThumbnail = new CopyObjectCommand({
      CopySource: `${this.bucketName}/${'thumbnails'}/${objectKey}`,
      Bucket: this.bucketName,
      Key: `${'temp-upload'}/${'thumbnails'}/${objectKey}`,
    });

    try {
      const moveObjectResponse = await this.s3Client.send(moveObjectCommand);

      if (moveObjectResponse.$metadata.httpStatusCode === HttpStatusCode.Ok) {
        const removedObject = await this.removeObject(objectKey);

        const moveObjectThumbnailResponse = await this.s3Client.send(moveObjectThumbnail);

        if (moveObjectThumbnailResponse.$metadata.httpStatusCode === HttpStatusCode.Ok) {
          await this.removeObject(`${'thumbnails'}/${objectKey}`);
        }

        return removedObject;
      }
    } catch (err) {
      return false;
    }
  };

  moveToTrashObjects = async (objectKeys: string[]) => {
    // Updated to accept an array of object keys
    for (const objectKey of objectKeys) {
      // Iterate over each object key
      await this.moveToTrashObject(objectKey);
    }
  };
}
