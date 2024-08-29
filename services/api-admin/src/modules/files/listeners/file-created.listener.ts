import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import fs from 'fs';
import path from 'path';

import { FILE_ROOT_PATH, THUMBNAIL_PATH, VALID_IMAGE_MIME_TYPES } from '../constants/files.constant';
import { FileCreatedEvent } from '../events/file-created.event';
import { createThumbnail } from '../utils/file.util';

@Injectable()
export class FileCreatedListener {
  @OnEvent('file.created')
  async handleFileCreatedEvent(event: FileCreatedEvent) {
    const { files, fileInfos } = event;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileInfo = fileInfos[i];
        const filePath = path.join(FILE_ROOT_PATH, fileInfo.uniqueName);

        fs.access(FILE_ROOT_PATH, fs.constants.F_OK, checkDirErr => {
          if (checkDirErr) throw new NotFoundException(`Path ${FILE_ROOT_PATH} does not exist`);

          fs.writeFile(filePath, file.buffer, writeErr => {
            if (writeErr) throw new UnprocessableEntityException(`Can not write ${filePath}`);

            if (VALID_IMAGE_MIME_TYPES.includes(fileInfo.mime)) {
              createThumbnail(filePath, THUMBNAIL_PATH, fileInfo.uniqueName);
            }
          });
        });
      }
    } catch (error) {
      throw new UnprocessableEntityException('Event file.created::' + error.message);
    }
  }
}
