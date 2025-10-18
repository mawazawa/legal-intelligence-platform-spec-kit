import { EvidenceItem } from '../types';

export const evidenceItems: EvidenceItem[] = [
  {
    id: 'math-error',
    type: 'calculation',
    title: 'Mathematical Impossibility',
    description: 'Petitioner\'s double-counting of $77,779.88 mortgage costs',
    source: 'RFO Analysis',
    relevance: 100,
    status: 'verified',
    citation: 'Petitioner\'s RFO, Paragraph 40',
    excerpt: 'Petitioner seeks to "add back" $77,779.88 that was already deducted from sale price'
  },
  {
    id: 'possession-date',
    type: 'timeline',
    title: 'Possession Transfer Date',
    description: 'Petitioner took possession on November 16, 2024',
    source: 'Petitioner\'s Declaration',
    relevance: 95,
    status: 'verified',
    citation: 'Petitioner\'s RFO, Paragraph 19',
    excerpt: 'On November 16, 2024, I took possession of the home'
  },
  {
    id: 'ex-parte-filings',
    type: 'document',
    title: 'Ex Parte Filing Pattern',
    description: '7 ex parte filings by Petitioner showing aggressive tactics',
    source: 'Court Records',
    relevance: 90,
    status: 'verified',
    citation: 'Register of Actions',
    excerpt: 'Petitioner filed 7 ex parte motions between June 2024 and May 2025'
  },
  {
    id: 'continuance-analysis',
    type: 'calculation',
    title: 'Continuance Attribution',
    description: 'Petitioner requested 8 of 12 continuances (67%)',
    source: 'Court Records',
    relevance: 85,
    status: 'verified',
    citation: 'Register of Actions Analysis',
    excerpt: 'Petitioner\'s claim of Respondent\'s delays contradicted by data'
  },
  {
    id: 'communication-analysis',
    type: 'email',
    title: 'Communication Responsiveness',
    description: 'Respondent more responsive to realtor than Petitioner',
    source: 'Email Records',
    relevance: 80,
    status: 'verified',
    citation: 'Email Analysis with Realtor',
    excerpt: 'Respondent average response time: 1.8 days vs Petitioner\'s 2.3 days'
  }
];
