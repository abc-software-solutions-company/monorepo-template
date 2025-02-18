import { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity } from '../interfaces/files.interface';

type FileIconProps = {
  file: FileEntity;
} & ComponentBaseProps;

const FileIcon: FC<FileIconProps> = ({ className, file }) => {
  return (
    <div className={classNames('relative aspect-video h-24 object-cover object-center', className)}>
      <div className="absolute left-1/2 top-1/2 h-12 w-10 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-amber-600">
        <p className="absolute bottom-2 left-1/2 -ml-6 w-12 rounded bg-primary px-1 text-center text-sm font-bold uppercase text-white">
          {file.ext.replace('.', '')}
        </p>
      </div>
    </div>
  );
};

export default FileIcon;
