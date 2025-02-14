import { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity } from '../interfaces/files.interface';

import { BASE_S3_MG_THUMBNAIL_URL } from '../constants/files.constant';

type FileThumbnailProps = {
  file: FileEntity;
} & ComponentBaseProps;

const FileThumbnail: FC<FileThumbnailProps> = ({ className, file }) => {
  return (
    <img
      className={classNames('relative aspect-video h-24 object-cover object-center', className)}
      src={BASE_S3_MG_THUMBNAIL_URL + file.uniqueName}
      alt={file.name || ''}
    />
  );
};

export default FileThumbnail;
