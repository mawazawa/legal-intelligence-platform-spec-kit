/**
 * Evidence Management Types
 * Defines TypeScript types for the evidence management system
 */

export type FileType = 'pdf' | 'image' | 'video' | 'document' | 'email' | 'text';

export type EvidenceCategory =
  | 'communication'
  | 'financial'
  | 'property'
  | 'procedural'
  | 'testimony'
  | 'expert';

export type FilingType = 'fl-320' | 'opposition' | 'rfo' | 'declaration' | 'brief' | 'motion';

export type ProducedBy = 'mathieu' | 'rosanna' | 'third_party';

export type AuthenticationMethod =
  | 'penalty_of_perjury'
  | 'notarized'
  | 'business_records'
  | 'self_authenticating'
  | 'certified_copy';

export type ClaimKey =
  | 'mortgage_relief'
  | 'appraisal_fmv'
  | 'escrow_closing'
  | 'continuances'
  | 'counsel_diligence'
  | 'math_errors'
  | 'exclusive_possession_watts'
  | 'foreclosure_timeline'
  | 'furniture_misrepresentation'
  | 'property_access';

/**
 * Main Evidence File Record
 */
export interface EvidenceFile {
  id: string;

  // File identification
  file_name: string;
  file_path: string;
  file_type: FileType;
  mime_type: string;
  file_size: number;
  checksum?: string;

  // Evidence metadata
  exhibit_letter?: string; // A, B, C, D, etc.
  exhibit_number?: number;
  title: string;
  description?: string;

  // Case linking
  case_number: string;
  hearing_date?: string;
  filing_type?: FilingType;

  // Document linking
  declaration_paragraph?: number;
  claim_key?: ClaimKey;

  // Legal categorization
  evidence_category?: EvidenceCategory;
  evidence_tags?: string[];

  // Party information
  produced_by?: ProducedBy;
  authenticated: boolean;
  authentication_method?: AuthenticationMethod;

  // Storage
  original_location?: string;
  storage_url?: string;
  thumbnail_url?: string;

  // OCR and searchability
  ocr_text?: string;
  ocr_completed_at?: string;
  searchable: boolean;

  // Timestamps
  date_created?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

/**
 * Exhibit Index Entry
 */
export interface ExhibitIndexEntry {
  id: string;
  filing_type: FilingType;
  filing_date?: string;
  exhibit_letter: string;
  exhibit_number: number;
  evidence_file_id: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Evidence Citation (where evidence is referenced in documents)
 */
export interface EvidenceCitation {
  id: string;
  evidence_file_id: string;
  document_type: FilingType;
  paragraph_number?: number;
  section_name?: string;
  page_number?: number;
  citation_text?: string;
  context?: string;
  created_at: string;
}

/**
 * Evidence with Exhibit Info (from view)
 */
export interface EvidenceWithExhibit extends EvidenceFile {
  exhibit_filing_type?: FilingType;
  exhibit_filing_date?: string;
  exhibit_description?: string;
  exhibit_sort_order?: number;
}

/**
 * Evidence Search Result
 */
export interface EvidenceSearchResult {
  id: string;
  file_name: string;
  title: string;
  description?: string;
  exhibit_letter?: string;
  exhibit_number?: number;
  ocr_text?: string;
  rank: number;
}

/**
 * Evidence Upload Input
 */
export interface EvidenceUploadInput {
  file: File;
  title: string;
  description?: string;
  exhibit_letter?: string;
  exhibit_number?: number;
  filing_type?: FilingType;
  declaration_paragraph?: number;
  claim_key?: ClaimKey;
  evidence_category?: EvidenceCategory;
  evidence_tags?: string[];
  produced_by?: ProducedBy;
  date_created?: string;
}

/**
 * Evidence Filter Options
 */
export interface EvidenceFilterOptions {
  filing_type?: FilingType;
  claim_key?: ClaimKey;
  evidence_category?: EvidenceCategory;
  file_type?: FileType;
  produced_by?: ProducedBy;
  authenticated?: boolean;
  searchable?: boolean;
  exhibit_letter?: string;
  declaration_paragraph?: number;
  tags?: string[];
  date_from?: string;
  date_to?: string;
}

/**
 * Exhibit Index Generation Options
 */
export interface ExhibitIndexOptions {
  filing_type: FilingType;
  include_descriptions?: boolean;
  format?: 'table' | 'list' | 'legal';
}

/**
 * Evidence Statistics
 */
export interface EvidenceStats {
  total_files: number;
  by_type: Record<FileType, number>;
  by_category: Record<EvidenceCategory, number>;
  by_filing: Record<FilingType, number>;
  authenticated_count: number;
  searchable_count: number;
  total_size_bytes: number;
}

/**
 * Evidence Cluster (for evidence matrix)
 */
export interface EvidenceCluster {
  claim_key: ClaimKey;
  evidence_count: number;
  evidence_types: {
    pdf: number;
    image: number;
    video: number;
    email: number;
    document: number;
  };
  files: EvidenceFile[];
  strength: 'strong' | 'moderate' | 'weak';
  suggestions?: string[];
}

/**
 * FL-320 Paragraph Evidence Link
 */
export interface FL320ParagraphEvidence {
  paragraph_number: number;
  paragraph_title: string;
  evidence_files: EvidenceFile[];
  citations: EvidenceCitation[];
  completeness: 'complete' | 'partial' | 'missing';
}
