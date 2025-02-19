import { FC } from 'react';
import classNames from 'classnames';
import { Checkbox } from '@repo/react-web-ui-shadcn/components/ui/checkbox';
import { convertBytes } from '@repo/shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FileEntity } from '../interfaces/files.interface';

import { FILE_STATUS } from '../constants/files.constant';

import FileIcon from './file-icon';
import FileThumbnail from './file-thumbnail';

type FileItemProps = {
  file: FileEntity;
  checked: boolean;
  onClick?: (file: FileEntity) => void;
} & ComponentBaseProps;

const FileItem: FC<FileItemProps> = ({ className, file, checked, onClick }) => {
  const getFileContent = (item: FileEntity) => {
    switch (item.ext) {
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
        return <FileThumbnail file={item} />;
      default:
        return <FileIcon file={item} />;
    }
  };

  return (
    <div
      className={classNames('cursor-pointer', file.status === FILE_STATUS.DELETED && 'pointer-events-none opacity-10', className)}
      onClick={() => onClick?.(file)}
    >
      <div key={file.id} className={classNames('relative overflow-hidden rounded-lg border-2 bg-background', checked && 'border-primary')}>
        <Checkbox className="absolute right-1 top-1 z-10" checked={checked} id={file.id} />
        <div className="pointer-events-none relative flex items-center justify-center bg-card" onClick={() => onClick?.(file)}>
          {getFileContent(file)}
        </div>
        <div className="bottom-0 left-0 w-full bg-black/10 p-1">
          <p className="mb-1 truncate text-xs" title={file.uniqueName}>
            {file.uniqueName}
          </p>
          <p className="text-xs text-gray-500">{convertBytes(file.size)}</p>
        </div>
      </div>
    </div>
  );
};

export default FileItem;
