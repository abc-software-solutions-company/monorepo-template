import React, { useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { cn } from '~react-web-ui-shadcn/lib/utils';
import { convertBytes } from '~shared-universal/utils/string.util';

const labelVariants = cva('px-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    state: {
      default: 'text-muted-foreground',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

type FilePreview = {
  file: File;
  preview: string;
};

const dropzoneVariants = cva(
  'h-64 max-w-md flex items-center justify-center cursor-pointer rounded-lg border bg-muted border-dashed text-center transition-colors',
  {
    variants: {
      state: {
        idle: 'border-muted hover:border-primary',
        active: 'border-primary bg-primary/20',
        error: 'border-destructive',
      },
    },
    defaultVariants: {
      state: 'idle',
    },
  }
);

const validateFile = (file: File, maxSize: number, acceptedFileTypes: string[]): { isValid: boolean; error?: string } => {
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
};

const createFilePreview = (file: File): FilePreview => ({
  file,
  preview: URL.createObjectURL(file),
});

type FilePreviewProps = {
  preview: FilePreview;
  onRemove: (preview: FilePreview) => void;
};

const FilePreviewComponent: React.FC<FilePreviewProps> = ({ preview, onRemove }) => (
  <div className="group relative h-full w-full">
    <img src={preview.preview} alt={preview.file.name} className={'h-full w-full rounded-md object-contain'} />
    <button
      className="absolute right-2 top-2 rounded-full bg-white p-1 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
      onClick={e => {
        e.stopPropagation();
        onRemove(preview);
      }}
    >
      <X className="h-4 w-4 text-gray-600" />
    </button>
  </div>
);

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
}) => (
  <div className={className} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={onClick}>
    <input ref={inputRef} type="file" accept={acceptedFileTypes.join(',')} className="hidden" onChange={onInputChange} />
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

type FileUploadRulesProps = {
  className?: string;
  maxSize: number;
  maxFiles: number;
  imageDimensions?: {
    width: number;
    height: number;
  };
};

const FileUploadRules: React.FC<FileUploadRulesProps> = ({ className, maxSize, maxFiles, imageDimensions }) => (
  <ul className={cn('list-inside list-disc space-y-1 text-xs text-muted-foreground', className)}>
    <li>Images should not be blurred</li>
    {imageDimensions && (
      <li>
        Images dimensions {imageDimensions.width}x{imageDimensions.height}
      </li>
    )}
    <li>
      Maximum of {maxFiles} file{maxFiles > 1 ? 's' : ''} can be uploaded
    </li>
    <li>File size should not exceed {convertBytes(maxSize)}</li>
    <li>Supports JPEG, PNG, JPG, HEIC (image files)</li>
  </ul>
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
  onFileSelect?: (files: File[]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({
  className,
  label,
  required = false,
  maxSize = 52428800,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'],
  maxFiles = 1,
  imageDimensions,
  onFileSelect,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [previews]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (fileArray.length + previews.length > maxFiles) {
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
      const newPreviews = validFiles.map(createFilePreview);

      setPreviews(prev => [...prev, ...newPreviews]);
      onFileSelect?.([...previews.map(p => p.file), ...validFiles]);
    } else if (validationError) {
      setError(validationError);
    }
  };

  const removePreview = (previewToRemove: FilePreview) => {
    URL.revokeObjectURL(previewToRemove.preview);
    setPreviews(prev => prev.filter(p => p !== previewToRemove));
    onFileSelect?.(previews.filter(p => p !== previewToRemove).map(p => p.file));
  };

  return (
    <div className={cn(className)}>
      <label className={cn(labelVariants({ state: error ? 'error' : 'default' }), className)}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <div
        className={dropzoneVariants({
          state: error ? 'error' : isDragActive ? 'active' : 'idle',
        })}
      >
        {previews.length === 0 ? (
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
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {previews.map((preview, index) => (
              <FilePreviewComponent key={index} preview={preview} onRemove={removePreview} />
            ))}
          </div>
        )}
      </div>
      <FileUploadRules className="mt-2" maxSize={maxSize} maxFiles={maxFiles} imageDimensions={imageDimensions} />
    </div>
  );
};

export default FileUpload;
