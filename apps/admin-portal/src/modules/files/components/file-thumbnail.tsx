import { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity } from '../interfaces/files.interface';

type FileThumbnailProps = {
  file: FileEntity;
} & ComponentBaseProps;

const FileThumbnail: FC<FileThumbnailProps> = ({ className, file }) => {
  return (
    <img
      className={classNames('relative aspect-video h-24 object-cover object-center', className)}
      src={import.meta.env.VITE_PUBLIC_API_URL + '/thumbnails/' + file.uniqueName}
      alt={file.name || ''}
    />
  );
};

export default FileThumbnail;
