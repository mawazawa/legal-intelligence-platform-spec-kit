import { CalculationStep } from '@/types/calculations';

export const calculationSteps: CalculationStep[] = [
  {
    stepNumber: 1,
    stepName: 'Gross Sale Price',
    explanation: 'The actual sale price of the property',
    amount: 1175000.00,
    formula: 'Contract Price',
    sources: [{
      documentName: 'Purchase Agreement',
      documentDate: '2025-04-16',
      sectionName: 'Purchase Price',
      excerpt: 'Buyer agrees to pay $1,175,000.00 for the property'
    }]
  },
  {
    stepNumber: 2,
    stepName: 'Less: Mortgage Payoff',
    explanation: 'Amount paid to lender at closing',
    amount: -759364.32,
    formula: 'Lender Demand',
    sources: [{
      documentName: 'Escrow Closing Statement',
      documentDate: '2025-05-30',
      sectionName: 'Line 101',
      excerpt: 'Lender Payoff: $759,364.32'
    }]
  },
  {
    stepNumber: 3,
    stepName: 'Less: Closing Costs',
    explanation: 'Real estate commissions, escrow fees, and other closing costs',
    amount: -135279.85,
    formula: 'Commissions + Fees',
    sources: [{
      documentName: 'Escrow Closing Statement',
      documentDate: '2025-05-30',
      sectionName: 'Lines 102-150',
      excerpt: 'Total closing costs: $135,279.85'
    }]
  },
  {
    stepNumber: 4,
    stepName: 'Net Proceeds to Sellers',
    explanation: 'Amount available for distribution to parties',
    amount: 280355.83,
    formula: 'Gross Sale - Mortgage Payoff - Closing Costs',
    sources: [{
      documentName: 'Escrow Closing Statement',
      documentDate: '2025-05-30',
      sectionName: 'Line 151',
      excerpt: 'Net Proceeds to Sellers: $280,355.83'
    }]
  },
  {
    stepNumber: 5,
    stepName: 'Petitioner\'s Share (35%)',
    explanation: 'Petitioner\'s portion per Judgment',
    amount: 98124.54,
    formula: 'Net Proceeds × 35%',
    sources: [{
      documentName: 'Judgment',
      documentDate: '2024-06-27',
      sectionName: 'Property Division',
      excerpt: 'Net proceeds divided 65% to Respondent, 35% to Petitioner'
    }]
  },
  {
    stepNumber: 6,
    stepName: 'Respondent\'s Share (65%)',
    explanation: 'Respondent\'s portion per Judgment',
    amount: 182231.29,
    formula: 'Net Proceeds × 65%',
    sources: [{
      documentName: 'Judgment',
      documentDate: '2024-06-27',
      sectionName: 'Property Division',
      excerpt: 'Net proceeds divided 65% to Respondent, 35% to Petitioner'
    }]
  }
];
