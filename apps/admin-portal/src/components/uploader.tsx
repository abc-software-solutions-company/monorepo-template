import { ChangeEvent, ReactNode, useRef } from 'react';
import classNames from 'classnames';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type UploaderProps = {
  loading?: boolean;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number;
  triggerClassName?: string;
  triggerContent?: ReactNode;
  triggerElement?: 'component' | 'button';
  onChange: (files: FileList) => void;
} & ComponentBaseProps;

const Uploader: React.FC<UploaderProps> = ({
  className,
  loading = false,
  multiple = true,
  maxFiles = 10,
  accept = undefined,
  triggerClassName,
  triggerElement = 'button',
  triggerContent = 'Upload',
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files?.length) onChange(files);
  };

  const renderTrigger = () => {
    if (triggerElement === 'button') {
      return (
        <>
          {loading && <Loading size="icon" thickness={2} />}
          <Button className={triggerClassName} onClick={() => fileInputRef.current?.click()}>
            {triggerContent}
          </Button>
        </>
      );
    }

    return (
      <>
        {loading && <Loading size="icon" thickness={2} />}
        <button className={triggerClassName} onClick={() => fileInputRef.current?.click()}>
          {triggerContent}
        </button>
      </>
    );
  };

  return (
    <div className={classNames(className)}>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        multiple={multiple}
        accept={accept}
        max={maxFiles}
        onChange={handleInputChange}
      />
      {renderTrigger()}
    </div>
  );
};

Uploader.displayName = 'Uploader';

export default Uploader;
