import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import sharp from 'sharp';
import { Repository } from 'typeorm';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { toSlug } from '@/common/utils/string.util';

import { FILE_GET_FIELDS, FILE_ROOT_PATH, FILE_STATUS, THUMBNAIL_WIDTH, VALID_IMAGE_MIME_TYPES } from './constants/files.constant';
import { FilterFileDto } from './dto/filter-file.dto';
import { UploadDto } from './dto/upload.dto';
import { File } from './entities/file.entity';
import { createThumbnail, getFileExtension, getFileName, saveFileToDisk } from './utils/file.util';

import { AwsService } from '../aws/aws.service';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly awsService: AwsService
  ) {}

  async uploadFiles(body: UploadDto, files: Array<Express.Multer.File>) {
    const uploadedFileInfos = [];

    for (const file of files) {
      try {
        const fileInfo = await this.processFile(file, body.categoryId);
        const fileData = this.fileRepository.create(fileInfo);

        await this.fileRepository.save(fileData);

        await this.handleUploadFileS3(fileInfo, file);
        // await this.handleUploadFileSelfHosted(fileInfo, file);

        uploadedFileInfos.push(fileInfo);
      } catch (error) {
        throw new UnprocessableEntityException(`Failed to process file ${file.originalname}: ${error.message}`);
      }
    }

    return uploadedFileInfos;
  }

  async handleUploadFileS3(fileInfo: File, file: Express.Multer.File) {
    await this.awsService.putObject({ key: fileInfo.uniqueName, body: file.buffer });

    if (VALID_IMAGE_MIME_TYPES.includes(fileInfo.mime)) {
      const thumb = sharp(file.buffer).resize(THUMBNAIL_WIDTH, null, { fit: 'contain' });

      await this.awsService.putObject({
        key: `thumbnails/${fileInfo.uniqueName}`,
        body: (await thumb.toBuffer()).buffer as Buffer,
      });
    }
  }

  async handleUploadFileSelfHosted(fileInfo: File, file: Express.Multer.File) {
    const filePath = path.join(FILE_ROOT_PATH, fileInfo.uniqueName);

    await saveFileToDisk(file, fileInfo.uniqueName);

    if (VALID_IMAGE_MIME_TYPES.includes(fileInfo.mime)) {
      await createThumbnail(filePath, fileInfo.uniqueName);
    }
  }

  async find(filterDto: FilterFileDto) {
    const { q, order, status, sort, mime, categoryId } = filterDto;

    const queryBuilder = this.fileRepository.createQueryBuilder('file').select(FILE_GET_FIELDS).leftJoin('file.category', 'category');

    if (status) {
      queryBuilder.where('file.status in (:...status)', { status });
    }
    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }
    if (q) {
      queryBuilder.andWhere('LOWER(file.name) LIKE LOWER(:name)', { name: `%${q}%` });
      queryBuilder.orWhere('LOWER(file.caption) LIKE LOWER(:caption)', { caption: `%${q}%` });
    }
    if (mime) {
      queryBuilder.andWhere('LOWER(file.mime) LIKE LOWER(:mime)', { mime: `${mime}%` });
    }
    if (sort) {
      queryBuilder.orderBy(`file.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else if (order) {
      queryBuilder.orderBy('file.createdAt', order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('file.createdAt', 'DESC');
    }
    queryBuilder.skip(filterDto.skip).take(filterDto.limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async remove(id: string) {
    const file = await this.fileRepository.findOneBy({ id });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    file.status = FILE_STATUS.DELETED;

    return this.fileRepository.save(file);
  }

  async bulkDelete(bulkDeleteFileDto: BulkDeleteDto) {
    const queryBuilder = this.fileRepository.createQueryBuilder().update(File).set({ status: FILE_STATUS.DELETED }).whereInIds(bulkDeleteFileDto.ids);
    const data = await queryBuilder.returning('id, status').execute();

    return data.raw;
  }

  private async processFile(file: Express.Multer.File, categoryId?: string): Promise<File> {
    const originalName = file.originalname;
    const caption = getFileName(file);
    const ext = await getFileExtension(file);
    const mime = file.mimetype;
    const size = file.size;
    const uniqueName = `${toSlug(caption)}-${Date.now()}${ext}`;

    const fileInfo = {
      name: originalName,
      uniqueName,
      caption,
      size,
      ext,
      mime,
      isTemp: false,
    } as File;

    if (categoryId) {
      fileInfo.category = { id: categoryId } as Category;
    }

    return fileInfo;
  }
}
