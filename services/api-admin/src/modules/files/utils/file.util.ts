import { UnsupportedMediaTypeException } from '@nestjs/common';
import { Request } from 'express';
import fileType from 'file-type';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { THUMBNAIL_WIDTH } from '../constants/files.constant';

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

export async function createThumbnail(filePath: string, thumbnailPath: string, fileName: string) {
  try {
    if (!fs.existsSync(thumbnailPath)) {
      fs.mkdirSync(thumbnailPath, { recursive: true });
    }

    await sharp(filePath)
      .resize(THUMBNAIL_WIDTH, null, {
        fit: 'contain',
      })
      .toFile(path.join(thumbnailPath, fileName));
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
