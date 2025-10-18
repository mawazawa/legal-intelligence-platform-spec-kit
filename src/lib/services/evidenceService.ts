/**
 * Evidence Service
 * Handles all evidence-related database operations
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '../logging/logger';
import type {
  EvidenceFile,
  EvidenceWithExhibit,
  EvidenceSearchResult,
  EvidenceFilterOptions,
  EvidenceStats,
  EvidenceCluster,
  ExhibitIndexEntry,
  EvidenceCitation,
  ClaimKey,
  FilingType,
} from '../types/evidence';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Get all evidence files with optional filtering
 */
export async function getEvidenceFiles(
  filters?: EvidenceFilterOptions
): Promise<EvidenceFile[]> {
  if (!supabase) {
    logger.debug('Supabase not configured, using mock data for evidence files');
    return getMockEvidenceFiles();
  }

  let query = supabase
    .from('evidence_files')
    .select('*')
    .is('deleted_at', null);

  // Apply filters
  if (filters?.filing_type) {
    query = query.eq('filing_type', filters.filing_type);
  }
  if (filters?.claim_key) {
    query = query.eq('claim_key', filters.claim_key);
  }
  if (filters?.evidence_category) {
    query = query.eq('evidence_category', filters.evidence_category);
  }
  if (filters?.file_type) {
    query = query.eq('file_type', filters.file_type);
  }
  if (filters?.produced_by) {
    query = query.eq('produced_by', filters.produced_by);
  }
  if (filters?.authenticated !== undefined) {
    query = query.eq('authenticated', filters.authenticated);
  }
  if (filters?.exhibit_letter) {
    query = query.eq('exhibit_letter', filters.exhibit_letter);
  }
  if (filters?.declaration_paragraph) {
    query = query.eq('declaration_paragraph', filters.declaration_paragraph);
  }
  if (filters?.date_from) {
    query = query.gte('date_created', filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte('date_created', filters.date_to);
  }
  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains('evidence_tags', filters.tags);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching evidence files', error as Error);
    throw new Error(`Failed to fetch evidence files: ${error.message}`);
  }

  return (data as EvidenceFile[]) || [];
}

/**
 * Get evidence files with exhibit information
 */
export async function getEvidenceWithExhibits(
  filingType?: FilingType
): Promise<EvidenceWithExhibit[]> {
  if (!supabase) {
    logger.debug('Supabase not configured, using mock data for evidence with exhibits');
    return getMockEvidenceFiles() as EvidenceWithExhibit[];
  }

  let query = supabase.from('active_evidence_with_exhibits').select('*');

  if (filingType) {
    query = query.eq('exhibit_filing_type', filingType);
  }

  const { data, error } = await query.order('exhibit_sort_order', { ascending: true });

  if (error) {
    logger.error('Error fetching evidence with exhibits', error as Error, { filingType });
    throw new Error(`Failed to fetch evidence with exhibits: ${error.message}`);
  }

  return (data as EvidenceWithExhibit[]) || [];
}

/**
 * Get single evidence file by ID
 */
export async function getEvidenceFileById(id: string): Promise<EvidenceFile | null> {
  if (!supabase) {
    const mockFiles = getMockEvidenceFiles();
    return mockFiles.find(f => f.id === id) || null;
  }

  const { data, error } = await supabase
    .from('evidence_files')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    logger.error('Error fetching evidence file', error as Error, { id });
    return null;
  }

  return data as EvidenceFile;
}

/**
 * Search evidence by text query
 */
export async function searchEvidence(
  query: string,
  limit: number = 20
): Promise<EvidenceSearchResult[]> {
  if (!supabase) {
    logger.debug('Supabase not configured, returning empty search results');
    return [];
  }

  const { data, error } = await supabase.rpc('search_evidence', {
    search_query: query,
    limit_count: limit,
  });

  if (error) {
    logger.error('Error searching evidence', error as Error, { query, limit });
    throw new Error(`Failed to search evidence: ${error.message}`);
  }

  return (data as EvidenceSearchResult[]) || [];
}

/**
 * Get evidence for a specific claim
 */
export async function getEvidenceForClaim(claimKey: ClaimKey): Promise<EvidenceFile[]> {
  if (!supabase) {
    return getMockEvidenceFiles().filter(f => f.claim_key === claimKey);
  }

  const { data, error } = await supabase.rpc('get_evidence_for_claim', {
    claim_key_param: claimKey,
  });

  if (error) {
    logger.error('Error getting evidence for claim', error as Error, { claimKey });
    throw new Error(`Failed to get evidence for claim: ${error.message}`);
  }

  return (data as EvidenceFile[]) || [];
}

/**
 * Get exhibit index for a filing
 */
export async function getExhibitIndex(filingType: FilingType): Promise<ExhibitIndexEntry[]> {
  if (!supabase) {
    logger.debug('Supabase not configured, using mock exhibit index', { filingType });
    return getMockExhibitIndex(filingType);
  }

  const { data, error } = await supabase.rpc('generate_exhibit_index', {
    filing_type_param: filingType,
  });

  if (error) {
    logger.error('Error generating exhibit index', error as Error, { filingType });
    throw new Error(`Failed to generate exhibit index: ${error.message}`);
  }

  return (data as any[]).map((row, index) => ({
    id: `${filingType}-${row.exhibit_letter}-${row.exhibit_number}`,
    filing_type: filingType,
    exhibit_letter: row.exhibit_letter,
    exhibit_number: row.exhibit_number,
    evidence_file_id: row.file_name, // This would be the actual ID in real usage
    description: row.description,
    sort_order: row.sort_order,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Get evidence citations for a document
 */
export async function getEvidenceCitations(
  documentType: FilingType,
  paragraphNumber?: number
): Promise<EvidenceCitation[]> {
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from('evidence_citations')
    .select('*')
    .eq('document_type', documentType);

  if (paragraphNumber !== undefined) {
    query = query.eq('paragraph_number', paragraphNumber);
  }

  const { data, error } = await query.order('paragraph_number', { ascending: true });

  if (error) {
    logger.error('Error fetching evidence citations', error as Error, { documentType, paragraphNumber });
    throw new Error(`Failed to fetch evidence citations: ${error.message}`);
  }

  return (data as EvidenceCitation[]) || [];
}

/**
 * Get evidence statistics
 */
export async function getEvidenceStats(): Promise<EvidenceStats> {
  if (!supabase) {
    return getMockEvidenceStats();
  }

  const { data: files, error } = await supabase
    .from('evidence_files')
    .select('file_type, evidence_category, filing_type, authenticated, searchable, file_size')
    .is('deleted_at', null);

  if (error) {
    logger.error('Error fetching evidence stats', error as Error);
    throw new Error(`Failed to fetch evidence stats: ${error.message}`);
  }

  const stats: EvidenceStats = {
    total_files: files.length,
    by_type: {} as Record<string, number>,
    by_category: {} as Record<string, number>,
    by_filing: {} as Record<string, number>,
    authenticated_count: 0,
    searchable_count: 0,
    total_size_bytes: 0,
  };

  files.forEach(file => {
    // Count by type
    if (file.file_type) {
      const fileType = String(file.file_type);
      (stats.by_type as Record<string, number>)[fileType] = ((stats.by_type as Record<string, number>)[fileType] || 0) + 1;
    }

    // Count by category
    if (file.evidence_category) {
      const category = String(file.evidence_category);
      (stats.by_category as Record<string, number>)[category] =
        ((stats.by_category as Record<string, number>)[category] || 0) + 1;
    }

    // Count by filing
    if (file.filing_type) {
      const filingType = String(file.filing_type);
      (stats.by_filing as Record<string, number>)[filingType] = ((stats.by_filing as Record<string, number>)[filingType] || 0) + 1;
    }

    // Count authenticated
    if (file.authenticated) {
      stats.authenticated_count++;
    }

    // Count searchable
    if (file.searchable) {
      stats.searchable_count++;
    }

    // Sum file sizes
    stats.total_size_bytes += file.file_size || 0;
  });

  return stats;
}

/**
 * Build evidence clusters for evidence matrix
 */
export async function buildEvidenceClusters(): Promise<EvidenceCluster[]> {
  const files = await getEvidenceFiles();

  const clusterMap = new Map<ClaimKey, EvidenceFile[]>();

  files.forEach(file => {
    if (file.claim_key) {
      const existing = clusterMap.get(file.claim_key) || [];
      clusterMap.set(file.claim_key, [...existing, file]);
    }
  });

  const clusters: EvidenceCluster[] = [];

  clusterMap.forEach((files, claimKey) => {
    const evidenceTypes = {
      pdf: files.filter(f => f.file_type === 'pdf').length,
      image: files.filter(f => f.file_type === 'image').length,
      video: files.filter(f => f.file_type === 'video').length,
      email: files.filter(f => f.file_type === 'email').length,
      document: files.filter(f => f.file_type === 'document').length,
    };

    const totalEvidence = files.length;
    let strength: 'strong' | 'moderate' | 'weak';

    if (totalEvidence >= 5) {
      strength = 'strong';
    } else if (totalEvidence >= 3) {
      strength = 'moderate';
    } else {
      strength = 'weak';
    }

    clusters.push({
      claim_key: claimKey,
      evidence_count: totalEvidence,
      evidence_types: evidenceTypes,
      files: files,
      strength: strength,
    });
  });

  return clusters;
}

/**
 * Get evidence for FL-320 paragraph
 */
export async function getEvidenceForParagraph(
  paragraphNumber: number
): Promise<EvidenceFile[]> {
  return getEvidenceFiles({ declaration_paragraph: paragraphNumber });
}

// ============================================================================
// MOCK DATA FOR DEVELOPMENT (when Supabase is not configured)
// ============================================================================

function getMockEvidenceFiles(): EvidenceFile[] {
  return [
    {
      id: '1',
      file_name: 'EXHIBIT_B_Text_Leave_Furniture_Nov8_2024.png',
      file_path: 'Evidence - Nov 2025 Hearing/EXHIBIT_B_Text_Leave_Furniture_Nov8_2024.png',
      file_type: 'image',
      mime_type: 'image/png',
      file_size: 656555,
      exhibit_letter: 'B',
      exhibit_number: 1,
      title: 'Text Message: Leave Furniture',
      description:
        'True and correct copy of text message exchange between Rosanna Claire Alvero and Piya Wauters regarding furniture remaining in Property',
      case_number: 'FDI-21-794666',
      filing_type: 'fl-320',
      declaration_paragraph: 61,
      claim_key: 'furniture_misrepresentation',
      evidence_category: 'communication',
      produced_by: 'rosanna',
      authenticated: true,
      authentication_method: 'penalty_of_perjury',
      searchable: false,
      date_created: '2024-11-08',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      file_name: 'EXHIBIT_C_Emails_Property_Retrieval.pdf',
      file_path: 'Evidence - Nov 2025 Hearing/EXHIBIT_C_Emails_Property_Retrieval.pdf',
      file_type: 'pdf',
      mime_type: 'application/pdf',
      file_size: 997761,
      exhibit_letter: 'C',
      exhibit_number: 1,
      title: 'Emails: Property Retrieval Communications',
      description:
        'True and correct copy of email communications regarding property retrieval and access',
      case_number: 'FDI-21-794666',
      filing_type: 'fl-320',
      declaration_paragraph: 40,
      claim_key: 'property_access',
      evidence_category: 'communication',
      produced_by: 'third_party',
      authenticated: true,
      authentication_method: 'penalty_of_perjury',
      searchable: false,
      date_created: '2024-11-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      file_name: 'EXHIBIT_MORTGAGE_Final_Statement.pdf',
      file_path: 'Evidence - Nov 2025 Hearing/EXHIBIT_MORTGAGE_Final_Statement.pdf',
      file_type: 'pdf',
      mime_type: 'application/pdf',
      file_size: 323240,
      exhibit_letter: 'D',
      exhibit_number: 1,
      title: 'Mortgage Final Statement',
      description: 'True and correct copy of Final Sellers Closing Statement dated May 30, 2025',
      case_number: 'FDI-21-794666',
      filing_type: 'fl-320',
      declaration_paragraph: 68,
      claim_key: 'escrow_closing',
      evidence_category: 'financial',
      produced_by: 'third_party',
      authenticated: true,
      authentication_method: 'business_records',
      searchable: false,
      date_created: '2025-05-30',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      file_name: 'EXHIBIT_VIDEO_Nov2_2024_Raid.mov',
      file_path: 'Evidence - Nov 2025 Hearing/EXHIBIT_VIDEO_Nov2_2024_Raid.mov',
      file_type: 'video',
      mime_type: 'video/quicktime',
      file_size: 30192902,
      exhibit_letter: 'E',
      exhibit_number: 1,
      title: 'Video: November 2, 2024 Property Incident',
      description:
        'True and correct copy of video recording from November 2, 2024 property incident',
      case_number: 'FDI-21-794666',
      filing_type: 'fl-320',
      declaration_paragraph: 34,
      claim_key: 'property_access',
      evidence_category: 'property',
      produced_by: 'mathieu',
      authenticated: true,
      authentication_method: 'penalty_of_perjury',
      searchable: false,
      date_created: '2024-11-02',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      file_name: 'Appraisal_refusal_Gmail - Re_ IMPORTANT INFO BEFORE 3_28 MEDIATION CONFERENCE.pdf',
      file_path:
        'Evidence - Nov 2025 Hearing/Appraisal_refusal_Gmail - Re_ IMPORTANT INFO BEFORE 3_28 MEDIATION CONFERENCE.pdf',
      file_type: 'pdf',
      mime_type: 'application/pdf',
      file_size: 1307330,
      exhibit_letter: 'F',
      exhibit_number: 1,
      title: 'Email: Appraisal Refusal Communication',
      description:
        'True and correct copy of email regarding appraisal and mediation conference information',
      case_number: 'FDI-21-794666',
      filing_type: 'fl-320',
      claim_key: 'appraisal_fmv',
      evidence_category: 'communication',
      produced_by: 'third_party',
      authenticated: true,
      authentication_method: 'penalty_of_perjury',
      searchable: false,
      date_created: '2024-03-28',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getMockExhibitIndex(filingType: FilingType): ExhibitIndexEntry[] {
  const mockFiles = getMockEvidenceFiles().filter(f => f.filing_type === filingType);

  return mockFiles.map((file, index) => ({
    id: `${filingType}-${file.exhibit_letter}-${file.exhibit_number}`,
    filing_type: filingType,
    exhibit_letter: file.exhibit_letter || '',
    exhibit_number: file.exhibit_number || 1,
    evidence_file_id: file.id,
    description: file.description || file.title,
    sort_order: index + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function getMockEvidenceStats(): EvidenceStats {
  const files = getMockEvidenceFiles();

  return {
    total_files: files.length,
    by_type: {
      pdf: 3,
      image: 1,
      video: 1,
      document: 0,
      email: 0,
      text: 0,
    },
    by_category: {
      communication: 3,
      financial: 1,
      property: 1,
      procedural: 0,
      testimony: 0,
      expert: 0,
    },
    by_filing: {
      'fl-320': 5,
      opposition: 0,
      rfo: 0,
      declaration: 0,
      brief: 0,
      motion: 0,
    },
    authenticated_count: 5,
    searchable_count: 0,
    total_size_bytes: 33477788,
  };
}
