import type { ComparisonPoint } from './types';

export const comparisonPoints: ComparisonPoint[] = [
  {
    id: 'net_proceeds_calculation',
    title: 'Net Proceeds Calculation',
    presentedBy: 'Petitioner',
    petitionerClaim: 'Add back $77,779.88 mortgage arrears to net proceeds ($280,355.83 + $77,779.88 = $358,155.71) before dividing 65/35',
    respondentRebuttal: 'Mortgage arrears were already paid from sale proceeds; cannot double-count by adding back to net proceeds',
    evidence: [
      'Final Sellers Closing Statement showing $280,355.83 net proceeds',
      'Statement of Decision property division orders',
      'Mortgage payoff documentation showing $759,364.32 paid to lender',
      'November 2024 mortgage statement showing arrears'
    ],
    feedback: [
      'This claim ignores that the arrears line was already satisfied at closing—flag the duplicate recovery attempt.',
      'Highlight escrow math: the closing statement already nets arrears before distribution.'
    ],
    status: 'disputed',
    pageRefs: {
      petitioner: 'RFO Attachment 7, Page 11',
      respondent: 'FL-320 Financial Computation'
    },
    clarifyingPrompts: [
      'Confirm whether any arrears remained unpaid post-close.',
      'Ask if Petitioner has a ledger showing arrears as a receivable after escrow.'
    ]
  },
  {
    id: 'petitioner_distribution',
    title: 'Petitioner\'s Distribution Calculation',
    presentedBy: 'Attorney',
    petitionerClaim: 'Petitioner receives $116,453.00 (35% of $358,155.71 = $125,354.50 minus $8,910.50 tax credit)',
    respondentRebuttal: 'Calculation based on incorrect net proceeds figure; should be based on actual $280,355.83 net proceeds',
    evidence: [
      'Petitioner\'s calculation: 35% × $358,155.71 = $125,354.50',
      'Tax withholding credit: $8,910.50 (65% of $13,694.62)',
      'Final amount: $125,354.50 - $8,910.50 = $116,453.00',
      'Statement of Decision 35% allocation'
    ],
    feedback: [
      'Attorney is anchoring off a gross figure that never passed through escrow—note the variance between SOD math and closing math.',
      'Call out that withholding credit should be symmetrical for both parties per SOD.'
    ],
    status: 'disputed',
    pageRefs: {
      petitioner: 'RFO Attachment 7, Page 5',
      respondent: 'FL-320 Distribution Analysis'
    },
    clarifyingPrompts: [
      'Ask for attorney workpapers supporting $358,155.71 as distributable base.',
      'Verify if tax credits were applied consistently to both parties in their exhibit.'
    ]
  },
  {
    id: 'respondent_distribution',
    title: 'Respondent\'s Distribution Calculation',
    presentedBy: 'Attorney',
    petitionerClaim: 'Respondent receives $163,902.83 (65% of $358,155.71 = $232,801.21 minus $77,779.88 arrears = $155,001.33 plus $8,901.50 tax credit)',
    respondentRebuttal: 'Double-counting mortgage arrears; respondent already paid arrears through sale proceeds',
    evidence: [
      'Petitioner\'s calculation: 65% × $358,155.71 = $232,801.21',
      'Subtract arrears: $232,801.21 - $77,779.88 = $155,001.33',
      'Add tax credit: $155,001.33 + $8,901.50 = $163,902.83',
      'Statement of Decision 65% allocation'
    ],
    feedback: [
      'Point out that Respondent\'s tax credit is cherry-picked - compare to Form 593 showing parallel withholding.',
      'Consider attaching escrow wire confirmation proving arrears payoff occurred before the split.'
    ],
    status: 'disputed',
    pageRefs: {
      petitioner: 'RFO Attachment 7, Page 5',
      respondent: 'FL-320 Distribution Analysis'
    },
    clarifyingPrompts: [
      'Do they contend arrears were not wired at close? If so, request supporting payoff statements.',
      'Confirm whether any escrow amendment exists showing arrears exception.'
    ]
  }
];
