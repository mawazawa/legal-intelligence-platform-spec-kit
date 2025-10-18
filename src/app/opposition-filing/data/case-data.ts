/**
 * Case data constants for Opposition Filing
 */

export const CASE_INFO = {
  caseNumber: 'FDI-21-794666',
  petitioner: 'Rosanna Claire Alvero',
  respondent: 'Mathieu Christian Yves Wauters',
  hearingDate: 'Tuesday, August 28, 2025',
  hearingTime: '8:30 AM',
  department: '[Department Number]',
} as const;

export const ATTORNEY_INFO = {
  name: '[Attorney Name]',
  firm: '[Firm Name]',
  address: '[Address]',
  phone: '[Phone Number]',
} as const;

export const RESPONDENT_INFO = {
  name: 'MATHIEU CHRISTIAN YVES WAUTERS',
  status: 'In Pro Per',
  address: '[Address]',
  cityStateZip: '[City, State ZIP]',
  phone: '[Phone]',
  email: '[Email]',
} as const;

export const PROPERTY_INFO = {
  address: '3525 8th Avenue, Los Angeles, CA 90018',
  possessionDate: 'November 16, 2024',
  listingDate: 'February 15, 2025',
  saleDate: 'May 30, 2025',
  possessionDays: 196,
  possessionMonths: 6.5,
} as const;

export const FINANCIAL_DATA = {
  grossSalePrice: 1050000.0,
  closingCosts: 10280.05,
  mortgagePrincipal: 681584.44,
  arrears: 77779.88,
  totalMortgagePayoff: 759364.32,
  netProceeds: 280355.83,
  respondentShare: 0.65,
  petitionerShare: 0.35,
  respondentAmount: 182231.29,
  petitionerAmount: 98124.54,
  petitionerFictitiousTotal: 358155.71,
  petitionerRequestedAmount: 125354.5,
  petitionerWindfall: 27229.96,
  taxWithholding: 13694.62,
  taxWithholdingRespondent: 8901.5,
  taxWithholdingPetitioner: 4793.12,
} as const;

export const CLAIMS = {
  attorneyFees: 40000,
  cleanupCosts: 6419,
  removalCosts: 2470,
  furniturePayment: 7500,
  furnitureValue: 15000,
  furnitureFraud: 22500,
  wattsMonthlyRate: 4500,
  wattsOffsetAmount: 29250,
} as const;

export const TIMELINE_EVENTS = [
  {
    date: 'December 2023',
    event: 'Last mortgage payment allegedly made (per Petitioner\'s claim)',
  },
  {
    date: 'November 16, 2024',
    event: 'PETITIONER TAKES EXCLUSIVE POSSESSION - All liability transfers to Petitioner',
  },
  {
    date: 'February 15, 2025',
    event: 'Property listed for sale (Petitioner in possession: 91 days)',
  },
  {
    date: 'May 30, 2025',
    event: 'PROPERTY SOLD - Petitioner in possession: 196 days (6.5 months)',
  },
] as const;

export const TABLE_OF_CONTENTS = [
  {
    title: 'DECLARATION OF MATHIEU CHRISTIAN YVES WAUTERS',
    page: 3,
    subsections: [
      { title: '1. Introduction and Personal Knowledge', page: 3 },
      { title: '2. Timeline of Events - Petitioner\'s Possession Control', page: 3 },
      { title: '3. Mathematical Impossibility of Petitioner\'s Calculations', page: 4 },
      { title: '4. Watts Charges Analysis - Timeline Cutoff', page: 5 },
      { title: '5. Tax Withholding Analysis', page: 5 },
      { title: '6. Attorney Fees Sanctions - No Evidence of Bad Faith', page: 6 },
      { title: '7. Cleanup Costs - Insufficient Evidence', page: 6 },
      { title: '8. Counter-Claims and Offsets', page: 7 },
      { title: '9. Legal Analysis', page: 7 },
      { title: '10. Requested Relief', page: 8 },
      { title: '11. Conclusion', page: 8 },
    ],
  },
  {
    title: 'DECLARATION OF TOM ROTERT',
    page: 9,
    subsections: [
      { title: '1. Personal Knowledge and Qualifications', page: 9 },
      { title: '2. Analysis of Petitioner\'s Mathematical Errors', page: 9 },
      { title: '3. Legal Authority and Precedent', page: 10 },
    ],
  },
  {
    title: 'MEMORANDUM OF POINTS AND AUTHORITIES',
    page: 10,
    subsections: [],
  },
] as const;
