/**
 * Mock Evidence Data
 * Centralized mock data for development and testing
 * Used when Supabase is not configured
 */

import type {
  EvidenceFile,
  EvidenceStats,
  ExhibitIndexEntry,
  FilingType,
} from '../types/evidence';

/**
 * Get mock evidence files
 * Realistic sample data representing various evidence types
 */
export function getMockEvidenceFiles(): EvidenceFile[] {
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

/**
 * Get mock exhibit index for a filing type
 */
export function getMockExhibitIndex(filingType: FilingType): ExhibitIndexEntry[] {
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

/**
 * Get mock evidence statistics
 */
export function getMockEvidenceStats(): EvidenceStats {
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
