import React, { useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '~react-web-ui-shadcn/lib/utils';
import { convertBytes } from '~shared-universal/utils/string.util';

type FileUploadProps = {
  onFileSelect?: (files: File[]) => void;
  maxSize?: number;
  acceptedFileTypes?: string[];
  className?: string;
};
type FilePreview = {
  file: File;
  preview: string;
};

const dropzoneVariants = cva('cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors', {
  variants: {
    state: {
      idle: 'border-gray-300 hover:border-blue-400',
      active: 'border-blue-500 bg-blue-50',
      error: 'border-red-500',
    },
  },
  defaultVariants: {
    state: 'idle',
  },
});

const buttonVariants = cva('rounded px-4 py-2 text-white transition-colors', {
  variants: {
    variant: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      error: 'bg-red-600 hover:bg-red-700',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

const previewGridVariants = cva('grid gap-4', {
  variants: {
    columns: {
      one: 'grid-cols-1',
      two: 'grid-cols-2',
      three: 'grid-cols-3',
      four: 'grid-cols-4',
    },
  },
  defaultVariants: {
    columns: 'two',
  },
});

const previewImageVariants = cva('rounded-lg object-cover', {
  variants: {
    size: {
      sm: 'h-32 w-full',
      md: 'h-40 w-full',
      lg: 'h-48 w-full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const FileUpload = ({
  onFileSelect,
  maxSize = 52428800,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'],
  className,
}: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [previews]);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);

      return false;
    }
    if (!acceptedFileTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image file.');

      return false;
    }

    return true;
  };

  const createPreviews = (files: File[]) => {
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(newPreviews);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);

    if (validFiles.length > 0) {
      setError('');
      createPreviews(validFiles);
      onFileSelect?.(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removePreview = (previewToRemove: FilePreview) => {
    URL.revokeObjectURL(previewToRemove.preview);
    setPreviews(prev => prev.filter(p => p !== previewToRemove));
    if (onFileSelect) {
      onFileSelect(previews.filter(p => p !== previewToRemove).map(p => p.file));
    }
  };

  return (
    <div className={cn('mx-auto w-full max-w-md space-y-4', className)}>
      {previews.length === 0 ? (
        <div
          className={dropzoneVariants({
            state: error ? 'error' : isDragActive ? 'active' : 'idle',
          })}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input ref={inputRef} type="file" accept={acceptedFileTypes.join(',')} className="hidden" onChange={handleInputChange} />
          <div className="space-y-4">
            {isDragActive ? (
              <div className="h-32 text-blue-500">Drop your files here</div>
            ) : (
              <div className="relative h-32">
                <p className="text-gray-700">Drag and drop files here, or</p>
                <button type="button" className={buttonVariants()}>
                  Choose file to upload
                </button>
                <p className="text-sm text-gray-500">Please upload images with format JPEG, PNG, JPG, HEIC</p>
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      ) : (
        <div className={previewGridVariants()}>
          {previews.map((preview, index) => (
            <div key={index} className="group relative">
              <img src={preview.preview} alt={`Preview ${index + 1}`} className={previewImageVariants()} />
              <button
                className="absolute right-2 top-2 rounded-full bg-white p-1 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                onClick={e => {
                  e.stopPropagation();
                  removePreview(preview);
                }}
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
              <p className="mt-1 truncate text-sm text-gray-600">{preview.file.name}</p>
            </div>
          ))}
        </div>
      )}
      <ul className="space-y-2 text-sm text-gray-600">
        <li>Images should not be blurred</li>
        <li>Images dimensions 000x000</li>
        <li>Maximum of 1 file can be uploaded</li>
        <li>File size should not exceed {convertBytes(maxSize)}</li>
        <li>Supports JPEG, PNG, JPG, HEIC (image files)</li>
      </ul>
    </div>
  );
};

export default FileUpload;
