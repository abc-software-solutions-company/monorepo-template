import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import path from 'path';
import sharp from 'sharp';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';

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
    private readonly fileRepository: EntityRepository<File>,
    private readonly awsService: AwsService,
    private readonly em: EntityManager
  ) { }

  async uploadFiles(body: UploadDto, files: Array<Express.Multer.File>) {
    const uploadedFileInfos = [];

    for (const file of files) {
      try {
        const fileInfo = await this.processFile(file, body.categoryId);
        const fileData = this.fileRepository.create(fileInfo);

        await this.em.persist(fileData);

        await this.handleUploadFileS3(fileInfo, file);
        // await this.handleUploadFileSelfHosted(fileInfo, file);

        uploadedFileInfos.push(fileInfo);
      } catch (error) {
        throw new UnprocessableEntityException(`Failed to process file ${file.originalname}: ${error.message}`);
      }
    }

    await this.em.flush();

    return uploadedFileInfos;
  }

  async handleUploadFileS3(fileInfo: File, file: Express.Multer.File) {
    await this.awsService.putObject({ key: fileInfo.uniqueName, body: file.buffer });

    if (VALID_IMAGE_MIME_TYPES.includes(fileInfo.mime)) {
      const thumb = sharp(file.buffer).resize(THUMBNAIL_WIDTH, null, { fit: 'contain' });

      await this.awsService.putObject({
        key: `thumbnails/${fileInfo.uniqueName}`,
        body: (await thumb.toBuffer()).buffer as unknown as Buffer,
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

    const queryBuilder = this.fileRepository.createQueryBuilder('file').select(FILE_GET_FIELDS).leftJoinAndSelect('file.category', 'category');

    if (status) {
      queryBuilder.where({ status: { $in: status } });
    }
    if (categoryId) {
      queryBuilder.andWhere({ category: categoryId });
    }
    if (q) {
      queryBuilder.andWhere({
        $or: [
          { name: { $ilike: `%${q}%` } },
          { caption: { $ilike: `%${q}%` } },
        ],
      });
    }
    if (mime) {
      queryBuilder.andWhere({ mime: { $like: `${mime}%` } });
    }
    if (sort) {
      queryBuilder.orderBy({ [sort]: order.toUpperCase() as 'ASC' | 'DESC' });
    } else if (order) {
      queryBuilder.orderBy({ createdAt: order.toUpperCase() as 'ASC' | 'DESC' });
    } else {
      queryBuilder.orderBy({ createdAt: 'DESC' });
    }
    queryBuilder.offset(filterDto.skip).limit(filterDto.limit);

    const [entities, totalItems] = await queryBuilder.getResultAndCount();
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async remove(id: string) {
    const file = await this.fileRepository.findOne({ id });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    file.status = FILE_STATUS.DELETED;

    await this.em.flush();

    return file;
  }

  async bulkDelete(bulkDeleteFileDto: BulkDeleteDto) {
    const files = await this.fileRepository.find({ id: { $in: bulkDeleteFileDto.ids } });

    files.forEach(file => (file.status = FILE_STATUS.DELETED));

    await this.em.flush();

    return files.map(file => ({ id: file.id, status: file.status }));
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
