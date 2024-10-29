import React, { useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { cn } from '~react-web-ui-shadcn/lib/utils';

const dropzoneVariants = cva('relative flex items-center justify-center cursor-pointer rounded-lg border border-dashed text-center', {
  variants: {
    state: {
      default: 'bg-muted hover:border-primary',
      active: 'border-primary !bg-primary/10',
      error: 'border-destructive !bg-destructive/10',
      focused: 'border-primary ring-2 ring-primary',
      disabled: '!bg-muted cursor-not-allowed',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

type FileUploadProps = {
  className?: string;
  label?: string;
  maxSize?: number;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  imageDimensions?: {
    width: number;
    height: number;
  };
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  isUploading?: boolean;
  onSelectFile?: (files: File[], filenames: string[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const FileUpload: React.FC<FileUploadProps> = ({
  className,
  maxSize = 52428800,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'],
  maxFiles = 10,
  error,
  disabled = false,
  isUploading = false,
  onSelectFile,
  onFocus,
  onBlur,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;

    const fileArray = Array.from(files);

    if (fileArray.length > maxFiles) {
      return;
    }

    const validFiles: File[] = [];
    let validationError = '';

    for (const file of fileArray) {
      const validation = validateFile(file, maxSize, acceptedFileTypes);

      if (validation.isValid) {
        validFiles.push(file);
      } else {
        validationError = validation.error || '';
        break;
      }
    }

    if (validFiles.length > 0) {
      const filenames = validFiles.map(file => file.name);
      onSelectFile?.(validFiles, filenames);
    } else if (validationError) {
    }
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
      onFocus?.();
    }
  };

  const handleBlur = () => {
    if (!disabled) {
      setIsFocused(false);
      onBlur?.();
    }
  };

  const getDropzoneState = () => {
    if (disabled) return 'disabled';
    if (isDragActive) return 'active';
    if (isFocused) return 'focused';
    if (error) return 'error';
    return 'default';
  };

  return (
    <div
      className={cn(
        dropzoneVariants({
          state: getDropzoneState(),
        }),
        className
      )}
    >
      <DropZone
        isDragActive={isDragActive}
        disabled={disabled}
        inputRef={inputRef}
        acceptedFileTypes={acceptedFileTypes}
        onDragOver={e => {
          if (!disabled) {
            e.preventDefault();
            setIsDragActive(true);
          }
        }}
        onDragLeave={e => {
          if (!disabled) {
            e.preventDefault();
            setIsDragActive(false);
          }
        }}
        onDrop={e => {
          if (!disabled) {
            e.preventDefault();
            setIsDragActive(false);
            handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        onInputChange={e => handleFiles(e.target.files)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isUploading && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-black/30">
          <p>Loading</p>
        </div>
      )}
    </div>
  );
};

function validateFile(file: File, maxSize: number, acceptedFileTypes: string[]): { isValid: boolean; error?: string } {
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File is too large. Max size is ${maxSize / 1024 / 1024}MB`,
    };
  }

  if (!acceptedFileTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload an image file.',
    };
  }

  return { isValid: true };
}

type DropZoneProps = {
  className?: string;
  isDragActive: boolean;
  disabled?: boolean;
  multiple?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  acceptedFileTypes: string[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
};

const DropZone: React.FC<DropZoneProps> = ({
  className,
  isDragActive,
  disabled,
  inputRef,
  acceptedFileTypes,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  onInputChange,
  onFocus,
  onBlur,
}) => (
  <div
    className={cn('flex h-full w-full items-center justify-center p-3', disabled && 'cursor-not-allowed', className)}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    onClick={onClick}
  >
    <input
      ref={inputRef}
      type="file"
      accept={acceptedFileTypes.join(',')}
      className="hidden"
      disabled={disabled}
      onChange={onInputChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
    {isDragActive ? (
      <p className="font-bold">Drop your files here</p>
    ) : (
      <div className="grid gap-5">
        <p className="font-bold">Drag and drop files here, or</p>
        <Button type="button" disabled={disabled}>
          Choose file to upload
        </Button>
        <p className="text-muted-foreground text-xs">Please upload images with format JPEG, PNG, JPG, HEIC</p>
      </div>
    )}
  </div>
);

export default FileUpload;
