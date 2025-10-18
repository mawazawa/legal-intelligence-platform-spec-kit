import { AutoTaggingResult } from '@/lib/services/autoTaggingService';

export interface CaseFile {
  id: string;
  name: string;
  originalName: string;
  type: 'judgment' | 'rfo' | 'fl320' | 'exhibit' | 'evidence' | 'financial' | 'email' | 'other';
  category: 'core' | 'supporting' | 'reference' | 'exhibit';
  tags: string[];
  date: string;
  size: string;
  description: string;
  relevance: 'critical' | 'important' | 'supporting' | 'reference';
  linkedTo?: string[];
  content?: string;
  metadata?: Record<string, any>;
  autoTaggingResult?: AutoTaggingResult;
  needsReview?: boolean;
}

export interface EnhancedCaseFileExplorerProps {
  files: CaseFile[];
  onFileSelect: (file: CaseFile) => void;
  onFileOpen: (file: CaseFile) => void;
  onFileUpdate: (fileId: string, updates: Partial<CaseFile>) => void;
  selectedFileId?: string;
}
