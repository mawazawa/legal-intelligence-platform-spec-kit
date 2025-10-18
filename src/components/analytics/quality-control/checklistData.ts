import { QualityCheckItem } from './types';

export const getDefaultChecklistItems = (): QualityCheckItem[] => [
  // Legal Checks
  {
    id: 'legal-001',
    category: 'legal',
    title: 'Family Code Section 2550 Compliance',
    description: 'Verify equal division requirement is met',
    required: true,
    checked: false,
    severity: 'critical',
    evidence: 'Family Code Section 2550 requires equal division of community property'
  },
  {
    id: 'legal-002',
    category: 'legal',
    title: 'Watts Charges Legal Standard',
    description: 'Confirm Watts charges end when possession changes',
    required: true,
    checked: false,
    severity: 'critical',
    evidence: 'Watts v. Watts (1985) 171 Cal.App.3d 366'
  },
  {
    id: 'legal-003',
    category: 'legal',
    title: 'Attorney Fees Sanctions Standard',
    description: 'Verify bad faith requirement for sanctions',
    required: true,
    checked: false,
    severity: 'high',
    evidence: 'Family Code Section 271 requires showing conduct that frustrates settlement policy'
  },

  // Mathematical Checks
  {
    id: 'math-001',
    category: 'mathematical',
    title: 'Double-Counting Error Identification',
    description: 'Confirm Petitioner\'s mathematical impossibility',
    required: true,
    checked: false,
    severity: 'critical',
    evidence: 'Petitioner attempts to both deduct and add back $77,779.88'
  },
  {
    id: 'math-002',
    category: 'mathematical',
    title: 'Net Proceeds Calculation Verification',
    description: 'Verify actual escrow proceeds amount',
    required: true,
    checked: false,
    severity: 'critical',
    evidence: 'Escrow Closing Statement shows $280,355.83'
  },
  {
    id: 'math-003',
    category: 'mathematical',
    title: 'Proportional Distribution Check',
    description: 'Confirm 65/35 split application',
    required: true,
    checked: false,
    severity: 'high',
    evidence: 'Judgment specifies 65% to Respondent, 35% to Petitioner'
  },

  // Citation Checks
  {
    id: 'cite-001',
    category: 'citation',
    title: 'Bluebook Formatting Compliance',
    description: 'Verify all citations follow Bluebook format',
    required: true,
    checked: false,
    severity: 'medium',
    evidence: 'All legal citations must follow Bluebook format'
  },
  {
    id: 'cite-002',
    category: 'citation',
    title: 'Page and Paragraph References',
    description: 'Confirm all evidence has specific page/paragraph citations',
    required: true,
    checked: false,
    severity: 'high',
    evidence: 'Each evidence item must have specific citation'
  },
  {
    id: 'cite-003',
    category: 'citation',
    title: 'Source Verification',
    description: 'Verify all sources are authentic and accessible',
    required: true,
    checked: false,
    severity: 'critical',
    evidence: 'All sources must be verifiable and authentic'
  },

  // Format Checks
  {
    id: 'format-001',
    category: 'format',
    title: 'Declaration Format Compliance',
    description: 'Verify declaration follows court format requirements',
    required: true,
    checked: false,
    severity: 'medium',
    evidence: 'Declaration must follow court format requirements'
  },
  {
    id: 'format-002',
    category: 'format',
    title: 'Exhibit Organization',
    description: 'Confirm exhibits are properly organized and labeled',
    required: true,
    checked: false,
    severity: 'medium',
    evidence: 'Exhibits must be properly organized and labeled'
  },
  {
    id: 'format-003',
    category: 'format',
    title: 'Print Formatting',
    description: 'Verify print formatting is correct',
    required: false,
    checked: false,
    severity: 'low',
    evidence: 'Print formatting should be optimized for court submission'
  },

  // Ethics Checks
  {
    id: 'ethics-001',
    category: 'ethics',
    title: 'Truthfulness Verification',
    description: 'Confirm all statements are truthful and accurate',
    required: true,
    checked: false,
    severity: 'critical',
    evidence: 'All statements must be truthful under penalty of perjury'
  },
  {
    id: 'ethics-002',
    category: 'ethics',
    title: 'No Misrepresentation',
    description: 'Verify no misrepresentation of facts or law',
    required: true,
    checked: false,
    severity: 'critical',
    evidence: 'No misrepresentation of facts or law is permitted'
  },
  {
    id: 'ethics-003',
    category: 'ethics',
    title: 'Client Confidentiality',
    description: 'Confirm client confidentiality is maintained',
    required: true,
    checked: false,
    severity: 'high',
    evidence: 'Client confidentiality must be maintained'
  },

  // Completeness Checks
  {
    id: 'complete-001',
    category: 'completeness',
    title: 'All Required Sections Included',
    description: 'Verify all required declaration sections are included',
    required: true,
    checked: false,
    severity: 'high',
    evidence: 'All required sections must be included'
  },
  {
    id: 'complete-002',
    category: 'completeness',
    title: 'Evidence Completeness',
    description: 'Confirm all evidence items are complete',
    required: true,
    checked: false,
    severity: 'high',
    evidence: 'All evidence items must be complete'
  },
  {
    id: 'complete-003',
    category: 'completeness',
    title: 'Counter-Evidence Analysis',
    description: 'Verify counter-evidence is properly analyzed',
    required: true,
    checked: false,
    severity: 'medium',
    evidence: 'Counter-evidence must be properly analyzed'
  }
];
