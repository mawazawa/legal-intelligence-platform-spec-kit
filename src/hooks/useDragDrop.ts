"use client";

import { useState, useCallback, DragEvent } from 'react';

interface UseDragDropOptions {
  onDrop: (files: File[]) => void | Promise<void>;
  accept?: string[]; // e.g., ['image/*', '.pdf']
  multiple?: boolean;
  maxSize?: number; // in bytes
  onError?: (error: string) => void;
}

interface UseDragDropReturn {
  isDragging: boolean;
  dragProps: {
    onDragOver: (e: DragEvent) => void;
    onDragEnter: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
  };
  getRootProps: () => {
    onDragOver: (e: DragEvent) => void;
    onDragEnter: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
    className: string;
  };
  getInputProps: () => {
    type: string;
    multiple: boolean;
    accept: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style: { display: string };
  };
  open: () => void;
}

/**
 * Custom hook for drag-and-drop file upload functionality
 *
 * Features:
 * - Visual feedback during drag operations
 * - File type validation
 * - File size validation
 * - Multiple file support
 * - Click-to-upload fallback
 * - Error handling
 *
 * @example
 * const { isDragging, getRootProps, getInputProps } = useDragDrop({
 *   onDrop: async (files) => {
 *     console.log('Files dropped:', files);
 *   },
 *   accept: ['image/*', '.pdf'],
 *   maxSize: 5 * 1024 * 1024, // 5MB
 * });
 *
 * return (
 *   <div {...getRootProps()}>
 *     <input {...getInputProps()} />
 *     {isDragging ? 'Drop files here' : 'Drag files or click to upload'}
 *   </div>
 * );
 */
export function useDragDrop({
  onDrop,
  accept = [],
  multiple = true,
  maxSize,
  onError,
}: UseDragDropOptions): UseDragDropReturn {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useState<HTMLInputElement | null>(null)[0];

  const validateFiles = useCallback((files: File[]): File[] => {
    const validFiles: File[] = [];

    for (const file of files) {
      // Check file size
      if (maxSize && file.size > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        onError?.(`File "${file.name}" exceeds ${sizeMB}MB size limit`);
        continue;
      }

      // Check file type
      if (accept.length > 0) {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        const isAccepted = accept.some(acceptType => {
          // Handle wildcards like 'image/*'
          if (acceptType.includes('/*')) {
            const [type] = acceptType.split('/');
            return fileType.startsWith(`${type}/`);
          }
          // Handle extensions like '.pdf'
          if (acceptType.startsWith('.')) {
            return fileName.endsWith(acceptType.toLowerCase());
          }
          // Handle exact mime types
          return fileType === acceptType;
        });

        if (!isAccepted) {
          onError?.(`File type "${file.type}" not accepted. Accepted types: ${accept.join(', ')}`);
          continue;
        }
      }

      validFiles.push(file);
    }

    return validFiles;
  }, [accept, maxSize, onError]);

  const handleDrop = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const filesToProcess = multiple ? fileArray : [fileArray[0]];
    const validFiles = validateFiles(filesToProcess);

    if (validFiles.length > 0) {
      await onDrop(validFiles);
    }
  }, [multiple, validateFiles, onDrop]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set isDragging to false if leaving the drop zone entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  const handleDropEvent = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleDrop(files);
  }, [handleDrop]);

  const open = useCallback(() => {
    // Programmatically open file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = accept.join(',');
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleDrop(target.files);
    };
    input.click();
  }, [multiple, accept, handleDrop]);

  const dragProps = {
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDropEvent,
  };

  const getRootProps = () => ({
    ...dragProps,
    className: isDragging ? 'drag-active' : '',
  });

  const getInputProps = () => ({
    type: 'file' as const,
    multiple,
    accept: accept.join(','),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleDrop(e.target.files);
    },
    style: { display: 'none' as const },
  });

  return {
    isDragging,
    dragProps,
    getRootProps,
    getInputProps,
    open,
  };
}

/**
 * Utility function to convert File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Utility function to format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
