import { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity } from '../interfaces/files.interface';

type FileThumbnailProps = {
  file: FileEntity;
} & ComponentBaseProps;

const FileThumbnail: FC<FileThumbnailProps> = ({ className, file }) => {
  return (
    <img className={classNames('relative aspect-video h-24 object-cover object-center', className)} src={file.thumbnailUrl} alt={file.name || ''} />
  );
};

export default FileThumbnail;
