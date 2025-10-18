import { EvidenceItem } from '../types';

export const evidenceDatabase: EvidenceItem[] = [
  // Mathematical Evidence
  {
    id: 'math-001',
    type: 'calculation',
    title: 'Petitioner\'s Double-Counting Error',
    description: 'Petitioner attempts to both deduct $77,779.88 from net proceeds AND add it back to create fictional total',
    source: 'Petitioner RFO, Attachment 7, Page 3',
    page: 3,
    paragraph: 12,
    line: 45,
    strength: 'airtight',
    category: 'petitioner',
    tags: ['mathematical error', 'double-counting', 'impossible calculation'],
    verified: true,
    citation: 'RFO Attachment 7, p.3, ¶12, l.45',
    rebuttal: 'Mathematically impossible - cannot both pay debt and add it back to proceeds',
    counterEvidence: ['math-002', 'math-003']
  },
  {
    id: 'math-002',
    type: 'calculation',
    title: 'Correct Net Proceeds Calculation',
    description: 'Actual escrow proceeds: $280,355.83 (already includes all mortgage payments)',
    source: 'Escrow Closing Statement, Page 1',
    page: 1,
    paragraph: 1,
    line: 15,
    strength: 'airtight',
    category: 'respondent',
    tags: ['correct calculation', 'escrow proceeds', 'verified amount'],
    verified: true,
    citation: 'Escrow Closing Statement, p.1, ¶1, l.15',
    rebuttal: 'This is the actual, verified amount from escrow company'
  },
  {
    id: 'math-003',
    type: 'calculation',
    title: 'Petitioner\'s Requested Distribution',
    description: 'Petitioner seeks 35% of $358,155.71 = $125,354.50 (based on impossible calculation)',
    source: 'Petitioner RFO, Page 5',
    page: 5,
    paragraph: 8,
    line: 23,
    strength: 'airtight',
    category: 'petitioner',
    tags: ['requested amount', 'based on error', 'impossible basis'],
    verified: true,
    citation: 'RFO, p.5, ¶8, l.23',
    rebuttal: 'Based on mathematically impossible "add back" of $77,779.88'
  },

  // Timeline Evidence
  {
    id: 'time-001',
    type: 'timeline',
    title: 'Petitioner\'s Possession Date',
    description: 'Petitioner admits taking possession on November 16, 2024',
    source: 'Petitioner Declaration, Paragraph 19',
    paragraph: 19,
    strength: 'airtight',
    category: 'petitioner',
    tags: ['possession date', 'admission', 'critical date'],
    verified: true,
    citation: 'Petitioner Decl., ¶19',
    rebuttal: 'This admission is fatal to her Watts charges claim'
  },
  {
    id: 'time-002',
    type: 'timeline',
    title: 'Watts Charges Cutoff',
    description: 'Watts charges must end on November 15, 2024 (day before possession)',
    source: 'Watts v. Watts (1985) 171 Cal.App.3d 366',
    strength: 'airtight',
    category: 'respondent',
    tags: ['watts charges', 'legal cutoff', 'possession law'],
    verified: true,
    citation: 'Watts v. Watts (1985) 171 Cal.App.3d 366',
    rebuttal: 'Legal requirement - cannot charge for exclusive use after taking possession'
  },
  {
    id: 'time-003',
    type: 'timeline',
    title: 'Property Sale Date',
    description: 'Property sold on May 30, 2025 - Petitioner had possession for 6+ months',
    source: 'Escrow Closing Statement',
    strength: 'airtight',
    category: 'respondent',
    tags: ['sale date', 'possession period', '6 months'],
    verified: true,
    citation: 'Escrow Closing Statement',
    rebuttal: 'Petitioner had exclusive use and benefit for 6+ months'
  },

  // Legal Evidence
  {
    id: 'legal-001',
    type: 'legal',
    title: 'Family Code Section 2550',
    description: 'Community property must be divided "equally" unless valid reason for unequal division',
    source: 'Family Code Section 2550',
    strength: 'airtight',
    category: 'respondent',
    tags: ['equal division', 'community property', 'statutory requirement'],
    verified: true,
    citation: 'Fam. Code § 2550',
    rebuttal: 'Petitioner\'s requested division violates this requirement'
  },
  {
    id: 'legal-002',
    type: 'legal',
    title: 'Family Code Section 271',
    description: 'Attorney fees sanctions require showing of conduct that "frustrates the policy of the law to promote settlement"',
    source: 'Family Code Section 271',
    strength: 'airtight',
    category: 'respondent',
    tags: ['attorney fees', 'sanctions', 'bad faith required'],
    verified: true,
    citation: 'Fam. Code § 271',
    rebuttal: 'No evidence of bad faith or settlement frustration'
  },
  {
    id: 'legal-003',
    type: 'legal',
    title: 'Watts Charges Legal Standard',
    description: 'Watts charges are for exclusive use and possession - end when possession changes',
    source: 'Watts v. Watts (1985) 171 Cal.App.3d 366',
    strength: 'airtight',
    category: 'respondent',
    tags: ['watts charges', 'exclusive use', 'possession change'],
    verified: true,
    citation: 'Watts v. Watts (1985) 171 Cal.App.3d 366',
    rebuttal: 'Petitioner\'s claims violate this legal standard'
  },

  // Financial Evidence
  {
    id: 'fin-001',
    type: 'financial',
    title: 'Mortgage Company Payment',
    description: 'Lender paid $759,364.32 at closing (includes $77,779.88 in arrears)',
    source: 'Escrow Closing Statement, Page 2',
    page: 2,
    paragraph: 3,
    line: 12,
    strength: 'airtight',
    category: 'neutral',
    tags: ['mortgage payment', 'lender payoff', 'arrears included'],
    verified: true,
    citation: 'Escrow Closing Statement, p.2, ¶3, l.12',
    rebuttal: 'This payment already includes the $77,779.88 - cannot be added back'
  },
  {
    id: 'fin-002',
    type: 'financial',
    title: 'Tax Withholding Amount',
    description: 'Tax withholding: $13,694.62 (should be split proportionally)',
    source: 'Tax Withholding Documentation',
    strength: 'moderate',
    category: 'petitioner',
    tags: ['tax withholding', 'proportional split', '65/35'],
    verified: true,
    citation: 'Tax Withholding Documentation',
    rebuttal: 'Should be split 65/35, not charged entirely to Respondent'
  },
  {
    id: 'fin-003',
    type: 'financial',
    title: 'Attorney Fees Request',
    description: 'Petitioner seeks $40,000 in attorney fees as sanctions',
    source: 'Petitioner RFO, Page 8',
    page: 8,
    paragraph: 15,
    line: 8,
    strength: 'weak',
    category: 'petitioner',
    tags: ['attorney fees', 'sanctions', 'no evidence'],
    verified: true,
    citation: 'RFO, p.8, ¶15, l.8',
    rebuttal: 'No evidence of bad faith or willful disregard'
  },

  // Communication Evidence
  {
    id: 'comm-001',
    type: 'communication',
    title: 'Cooperation Attempts',
    description: 'Respondent made multiple attempts to cooperate with property sale',
    source: 'Email Correspondence, March 2025',
    strength: 'moderate',
    category: 'respondent',
    tags: ['cooperation', 'email records', 'good faith'],
    verified: true,
    citation: 'Email Correspondence, March 2025',
    rebuttal: 'Shows good faith efforts, not willful disregard'
  },
  {
    id: 'comm-002',
    type: 'communication',
    title: 'Petitioner\'s Delays',
    description: 'Petitioner caused delays in property sale process',
    source: 'Realtor Correspondence',
    strength: 'moderate',
    category: 'respondent',
    tags: ['delays', 'petitioner caused', 'realtor records'],
    verified: true,
    citation: 'Realtor Correspondence',
    rebuttal: 'Petitioner\'s own actions caused delays'
  }
];
