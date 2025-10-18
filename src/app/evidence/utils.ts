import { FileText, Image, Video, Mail, File } from 'lucide-react';
import type { FileType } from '@/lib/types/evidence';

export const getFileIcon = (fileType: FileType) => {
  switch (fileType) {
    case 'pdf':
    case 'document':
      return <FileText className="h-6 w-6 text-red-500" />;
    case 'image':
      return <Image className="h-6 w-6 text-blue-500" />;
    case 'video':
      return <Video className="h-6 w-6 text-purple-500" />;
    case 'email':
      return <Mail className="h-6 w-6 text-green-500" />;
    default:
      return <File className="h-6 w-6 text-gray-500" />;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
