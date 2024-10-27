import React, { useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { cn } from '~react-web-ui-shadcn/lib/utils';

const dropzoneVariants = cva('flex items-center justify-center cursor-pointer rounded-lg border  border-dashed text-center transition-colors', {
  variants: {
    state: {
      default: 'bg-muted hover:border-primary',
      active: 'border-primary bg-primary/20',
      error: 'border-destructive',
      focused: 'border-primary ring-2 ring-primary',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

type DropZoneProps = {
  className?: string;
  isDragActive: boolean;
  multiple?: boolean;
  error?: string;
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
  error,
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
  <div className={className} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={onClick}>
    <input
      ref={inputRef}
      type="file"
      accept={acceptedFileTypes.join(',')}
      className="hidden"
      onChange={onInputChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
    {isDragActive ? (
      <p className="font-bold">Drop your files here</p>
    ) : (
      <div className="grid gap-5">
        <p className="font-bold">Drag and drop files here, or</p>
        <Button type="button">Choose file to upload</Button>
        <p className="text-xs text-muted-foreground">Please upload images with format JPEG, PNG, JPG, HEIC</p>
      </div>
    )}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

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
  onFileSelect?: (files: File[], filenames: string[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const FileUpload: React.FC<FileUploadProps> = ({
  className,
  maxSize = 52428800,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'],
  maxFiles = 1,
  onFileSelect,
  onFocus,
  onBlur,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);

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
      setError('');
      const filenames = validFiles.map(file => file.name);

      onFileSelect?.(validFiles, filenames);
    } else if (validationError) {
      setError(validationError);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div
      className={cn(
        dropzoneVariants({
          state: error ? 'error' : isDragActive ? 'active' : isFocused ? 'focused' : 'default',
        }),
        className
      )}
    >
      <DropZone
        className="flex h-full w-full items-center justify-center p-3"
        isDragActive={isDragActive}
        error={error}
        inputRef={inputRef}
        acceptedFileTypes={acceptedFileTypes}
        onDragOver={e => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setIsDragActive(false);
        }}
        onDrop={e => {
          e.preventDefault();
          setIsDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onInputChange={e => handleFiles(e.target.files)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default FileUpload;

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
