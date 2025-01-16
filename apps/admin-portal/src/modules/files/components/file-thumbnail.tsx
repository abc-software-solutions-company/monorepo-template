import { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity } from '../interfaces/files.interface';

import { FILE_PATH } from '../constants/files.constant';

type FileThumbnailProps = {
  file: FileEntity;
} & ComponentBaseProps;

const FileThumbnail: FC<FileThumbnailProps> = ({ className, file }) => {
  return (
    <img
      className={classNames('relative aspect-video h-24 object-cover object-center', className)}
      src={`${FILE_PATH}/thumbnails/${file.uniqueName}`}
      alt={file.name || ''}
    />
  );
};

export default FileThumbnail;
