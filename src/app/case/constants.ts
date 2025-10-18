export const SECTIONS = {
  OVERVIEW: 'overview',
  FINANCIAL: 'financial',
  RFO_ANALYSIS: 'rfo-analysis',
  COST_BREAKDOWN: 'cost-breakdown',
  LEGAL_DOCS: 'legal-documents',
  RESPONSIVE_DECLARATION: 'responsive-declaration',
  ROTERT_DECLARATION: 'rotert-declaration',
  ANALYTICS: 'analytics',
  CLAIMS: 'claims-analysis',
  CONTINUANCES: 'continuances',
  TIMELINE: 'timeline',
} as const;

export const CASE_INFO = {
  caseNumber: 'FDI-21-794666',
  title: 'In Re Marriage of Alvero & Wauters',
  court: 'San Francisco Superior Court',
  hearingDate: 'August 28, 2025',
  department: '403',
} as const;

export const FINANCIAL_DATA = {
  netProceeds: '$280,355.83',
  petitionerShare35: '$98,124.54',
  respondentShare65: '$182,231.29',
  mortgageAddBack: '$77,779.88',
  incorrectTotal: '$358,155.71',
} as const;

export const CLAIMS_DATA = {
  invalid: { amount: '$145,780', percentage: 69 },
  valid: { amount: '$65,317', percentage: 31 },
  netProceeds: '$280,356',
} as const;

export const CONTINUANCES_DATA = {
  total: 12,
  petitionerRequests: 8,
  percentage: 67,
} as const;
