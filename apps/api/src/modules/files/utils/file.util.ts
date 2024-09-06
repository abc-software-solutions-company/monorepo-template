import { NotFoundException, UnprocessableEntityException, UnsupportedMediaTypeException } from '@nestjs/common';
import { Request } from 'express';
import fileType from 'file-type';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { FILE_ROOT_PATH, THUMBNAIL_PATH, THUMBNAIL_WIDTH } from '../constants/files.constant';

export const getFileName = (file: Express.Multer.File) => {
  const fileName = path.basename(file.originalname, path.extname(file.originalname));

  return fileName;
};

export const getFileExtension = async (file: Express.Multer.File) => {
  let ext = path.extname(file.originalname);

  if (!ext) {
    const mimeType = await fileType.fromBuffer(file.buffer);

    ext = `.${mimeType.ext}`;
  }

  return ext;
};

export function mimetypeFilter(...mimetypes: string[]) {
  return (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (mimetypes.some(m => file.mimetype.includes(m))) {
      callback(null, true);
    } else {
      callback(new UnsupportedMediaTypeException(`File type is not matching: ${mimetypes.join(', ')}`), false);
    }
  };
}

export async function createThumbnail(filePath: string, fileName: string) {
  try {
    if (!fs.existsSync(THUMBNAIL_PATH)) {
      fs.mkdirSync(THUMBNAIL_PATH, { recursive: true });
    }

    await sharp(filePath)
      .resize(THUMBNAIL_WIDTH, null, {
        fit: 'contain',
      })
      .toFile(path.join(THUMBNAIL_PATH, fileName));
  } catch (error) {
    throw new Error('Can not create thumbnail');
  }
}

export function copyFile(sourceFilePath: string, destinationFilePath: string) {
  try {
    const data = fs.readFileSync(sourceFilePath);

    fs.writeFileSync(destinationFilePath, data);
  } catch (error) {
    throw new Error('Can not copy file');
  }
}

export function createDirectory(directoryPath: string) {
  try {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  } catch (error) {
    throw new Error('Can not create directory');
  }
}

export function removeDirectory(directoryPath: string) {
  try {
    if (fs.existsSync(directoryPath)) {
      fs.rmSync(directoryPath, { recursive: true });

      return true;
    }
  } catch (error) {
    throw new Error('Can not remove directory');
  }
}

export async function saveFileToDisk(file: Express.Multer.File, uniqueName: string): Promise<void> {
  const filePath = path.join(FILE_ROOT_PATH, uniqueName);

  await fs.promises.access(FILE_ROOT_PATH, fs.constants.F_OK).catch(() => {
    throw new NotFoundException(`Path ${FILE_ROOT_PATH} does not exist`);
  });

  await fs.promises.writeFile(filePath, file.buffer).catch(() => {
    throw new UnprocessableEntityException(`Cannot write to ${filePath}`);
  });
}
