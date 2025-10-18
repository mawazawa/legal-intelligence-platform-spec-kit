/**
 * RFO Opposition Checklist Item Definitions
 * DRY: Single source of truth for all checklist items
 */

import { RFOChecklistItem } from '@/types/checklist';

export const BASE_CHECKLIST_ITEMS: RFOChecklistItem[] = [
  {
    id: 'fl-320',
    category: 'Required Forms',
    title: 'FL-320 Responsive Declaration',
    description: 'Main form to respond to the Request for Order',
    plainEnglish: 'This is your main response form where you tell the court your side of the story. Think of it as your "answer" to what the other party asked for.',
    required: true,
    status: 'not-started',
    priority: 'critical',
    estimatedMinutes: 30,
    documentUrl: 'https://courts.ca.gov/documents/fl320.pdf',
    helpUrl: 'https://courts.ca.gov/documents/fl320info.pdf'
  },
  {
    id: 'proof-of-service',
    category: 'Required Forms',
    title: 'Proof of Service',
    description: 'Documentation showing you served the other party',
    plainEnglish: 'Proof that you sent copies of your paperwork to the other party. Someone over 18 (not you!) must deliver or mail the documents, then fill out this form.',
    required: true,
    status: 'not-started',
    priority: 'critical',
    estimatedMinutes: 10
  }
];

export const FINANCIAL_FORMS: RFOChecklistItem[] = [
  {
    id: 'fl-150',
    category: 'Financial Forms',
    title: 'FL-150 Income and Expense Declaration',
    description: 'Complete financial disclosure form',
    plainEnglish: 'Your complete financial picture: what you earn, what you spend, what you own, and what you owe. Required for any money-related requests.',
    required: true,
    status: 'not-started',
    priority: 'critical',
    estimatedMinutes: 45,
    documentUrl: 'https://courts.ca.gov/documents/fl150.pdf'
  },
  {
    id: 'pay-stubs',
    category: 'Supporting Documents',
    title: 'Recent Pay Stubs (2 months)',
    description: 'Last 2 months of pay stubs or income proof',
    plainEnglish: 'Your most recent pay stubs showing what you actually earn. If self-employed, bring profit/loss statements or Schedule C from your tax return.',
    required: true,
    conditionalOn: ['fl-150'],
    status: 'not-started',
    priority: 'high',
    estimatedMinutes: 5
  },
  {
    id: 'tax-returns',
    category: 'Supporting Documents',
    title: 'Most Recent Tax Return',
    description: 'Your last filed federal tax return',
    plainEnglish: 'Bring your complete tax return to the hearing (you don\'t file it, just have it ready). Black out your social security number before bringing copies.',
    required: true,
    conditionalOn: ['fl-150'],
    status: 'not-started',
    priority: 'high',
    estimatedMinutes: 5
  }
];

export const CUSTODY_FORMS: RFOChecklistItem[] = [
  {
    id: 'fl-105',
    category: 'Custody Forms',
    title: 'FL-105 UCCJEA Declaration',
    description: 'Declaration about child custody jurisdiction',
    plainEnglish: 'A form telling the court where your child has lived for the past 5 years. This helps the court decide if California is the right place to make custody decisions.',
    required: true,
    status: 'not-started',
    priority: 'critical',
    estimatedMinutes: 20,
    documentUrl: 'https://courts.ca.gov/documents/fl105.pdf'
  },
  {
    id: 'fl-311',
    category: 'Custody Forms',
    title: 'FL-311 Child Custody and Visitation Application',
    description: 'Details about your custody/visitation request',
    plainEnglish: 'Describe what custody arrangement you want: where the child lives, when they visit the other parent, holidays, etc. Be specific about your ideal schedule.',
    required: false,
    status: 'not-started',
    priority: 'high',
    estimatedMinutes: 30,
    documentUrl: 'https://courts.ca.gov/documents/fl311.pdf'
  }
];

export const ATTORNEY_FEE_FORMS: RFOChecklistItem[] = [
  {
    id: 'fl-319',
    category: 'Fee Forms',
    title: 'FL-319 Request for Attorney Fees Attachment',
    description: 'Breakdown of attorney fees requested',
    plainEnglish: 'If asking for the other party to pay your lawyer, explain why you need help with fees and list all costs (hourly rate, hours worked, court filing fees, etc.).',
    required: true,
    status: 'not-started',
    priority: 'high',
    estimatedMinutes: 25,
    documentUrl: 'https://courts.ca.gov/documents/fl319.pdf'
  }
];

export const PROPERTY_DIVISION_FORMS: RFOChecklistItem[] = [
  {
    id: 'property-declaration',
    category: 'Property Forms',
    title: 'Property Declaration and Financial Analysis',
    description: 'Detailed breakdown of property division calculations',
    plainEnglish: 'For complex property issues (like dividing home sale proceeds), attach detailed calculations showing how you arrived at your numbers. Include source documents.',
    required: true,
    status: 'not-started',
    priority: 'critical',
    estimatedMinutes: 60
  },
  {
    id: 'financial-exhibit',
    category: 'Exhibits',
    title: 'Exhibit: Financial Computation',
    description: 'Your calculation exhibit from the Financial Distribution page',
    plainEnglish: 'Use the Financial Distribution Calculator tool to generate a court-ready exhibit showing exactly how property should be divided. This becomes Exhibit A or B.',
    required: true,
    status: 'not-started',
    priority: 'critical',
    estimatedMinutes: 15
  }
];

export const OPTIONAL_ITEMS: RFOChecklistItem[] = [
  {
    id: 'memo-points-auth',
    category: 'Legal Arguments',
    title: 'Memorandum of Points and Authorities',
    description: 'Legal brief with case law and statutes',
    plainEnglish: 'Optional but powerful: a legal brief citing laws and court cases that support your position. Usually prepared by an attorney, but you can do it yourself with research.',
    required: false,
    status: 'not-started',
    priority: 'medium',
    estimatedMinutes: 120
  },
  {
    id: 'supporting-declaration',
    category: 'Declarations',
    title: 'Supporting Declarations',
    description: 'Statements from witnesses or experts',
    plainEnglish: 'Written statements from people who can support your case (family, friends, doctors, therapists). Must be signed under penalty of perjury.',
    required: false,
    status: 'not-started',
    priority: 'low',
    estimatedMinutes: 30
  }
];

/**
 * Build checklist based on RFO type
 */
export function buildChecklistForRFOType(rfoType: string): RFOChecklistItem[] {
  const items = [...BASE_CHECKLIST_ITEMS];

  // Add financial forms for money-related RFOs
  if (['child-support', 'spousal-support', 'property-division', 'attorney-fees'].includes(rfoType)) {
    items.push(...FINANCIAL_FORMS);
  }

  // Add custody-specific forms
  if (rfoType === 'custody-visitation') {
    items.push(...CUSTODY_FORMS);
  }

  // Add attorney fee forms
  if (rfoType === 'attorney-fees') {
    items.push(...ATTORNEY_FEE_FORMS);
  }

  // Add property division forms
  if (rfoType === 'property-division') {
    items.push(...PROPERTY_DIVISION_FORMS);
  }

  // Add optional items
  items.push(...OPTIONAL_ITEMS);

  return items;
}
