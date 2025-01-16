import { FC, useState } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity } from '../interfaces/files.interface';

type FileThumbnailProps = {
  file: FileEntity;
} & ComponentBaseProps;

const FileThumbnail: FC<FileThumbnailProps> = ({ className, file }) => {
  const [isImgError, setImgError] = useState(false);

  //to ensure that the image is not broken
  const imgSrc = isImgError || !file.thumbnailUrl ? `${import.meta.env.VITE_PUBLIC_API_URL}/thumbnails/${file.uniqueName}` : file.thumbnailUrl;

  return (
    <img
      className={classNames('relative aspect-video h-24 object-cover object-center', className)}
      src={imgSrc}
      alt={file.name || ''}
      onError={() => setImgError(true)}
    />
  );
};

export default FileThumbnail;
