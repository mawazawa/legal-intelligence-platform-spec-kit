import { RFOAnalysisData, ExParteTimelineItem } from './types';

export const getMockRFOData = (): RFOAnalysisData => ({
  summary: {
    totalPetitionerClaims: 211097.19,
    totalInvalidClaims: 145780.38,
    totalValidClaims: 65316.81,
    netRespondentPosition: 75460.31,
    invalidPercentage: 69,
    analysisDate: new Date().toISOString()
  },
  mathematicalErrors: {
    totalInvalidClaims: 145780.38,
    percentage: 69,
    coreError: 'Double-counting $77,779.88 mortgage costs',
    detailedExplanation: 'Petitioner attempts to both deduct the mortgage payoff from sale proceeds AND add it back as a separate community debt. This is mathematically impossible and constitutes double-counting. The mortgage was already paid from escrow proceeds, so it cannot be "added back" to the distribution calculation.',
    sources: [
      {
        document: 'Petitioner\'s RFO',
        page: 8,
        section: 'Schedule of Assets and Debts',
        date: '2025-01-15',
        type: 'rfo'
      },
      {
        document: 'Settlement Statement (HUD-1)',
        page: 1,
        section: 'Line 504 - Payoff of first mortgage',
        date: '2024-05-31',
        type: 'settlement_stmt'
      }
    ]
  },
  propertyDetails: {
    address: '123 Main Street, City, CA 12345',
    salePrice: 1175000.00,
    saleDate: '2024-05-31',
    mortgagePayoff: 759364.32,
    closingCosts: 135279.85,
    netProceeds: 280355.83,
    sources: [
      {
        document: 'Final Settlement Statement',
        page: 1,
        date: '2024-05-31',
        type: 'settlement_stmt'
      }
    ]
  },
  timeline: {
    possessionDate: 'November 16, 2024',
    daysOfUse: 196,
    offsetValue: 29250,
    calculationMethod: 'Fair rental value at $4,500/month × 6.5 months (196 days)',
    sources: [
      {
        document: 'Court Order Re: Possession',
        page: 2,
        date: '2024-11-16',
        type: 'court_order'
      }
    ]
  },
  exParteFilings: {
    total: 7,
    frequency: '1 filing every 1.7 months',
    impact: 'Aggressive litigation tactics',
    filings: [
      {
        date: '2024-06-14',
        filing: 'Ex Parte Application to List Property for Sale',
        impact: 'high',
        source: { document: 'ROA Entry #45', date: '2024-06-14', type: 'roa' }
      },
      {
        date: '2024-08-09',
        filing: 'Ex Parte Application for Sole Possession',
        impact: 'high',
        source: { document: 'ROA Entry #52', date: '2024-08-09', type: 'roa' }
      },
      {
        date: '2024-09-12',
        filing: 'Ex Parte Application for Declutter Order',
        impact: 'medium',
        source: { document: 'ROA Entry #58', date: '2024-09-12', type: 'roa' }
      },
      {
        date: '2024-10-03',
        filing: 'Ex Parte Application to Vacate Property',
        impact: 'high',
        source: { document: 'ROA Entry #63', date: '2024-10-03', type: 'roa' }
      },
      {
        date: '2024-11-16',
        filing: 'Ex Parte Application for Possession Enforcement',
        impact: 'high',
        source: { document: 'ROA Entry #71', date: '2024-11-16', type: 'roa' }
      },
      {
        date: '2025-04-22',
        filing: 'Ex Parte Application for Elisor Signature',
        impact: 'medium',
        source: { document: 'ROA Entry #89', date: '2025-04-22', type: 'roa' }
      },
      {
        date: '2025-05-01',
        filing: 'Ex Parte Application for Court Signature',
        impact: 'medium',
        source: { document: 'ROA Entry #92', date: '2025-05-01', type: 'roa' }
      }
    ]
  },
  continuances: {
    total: 12,
    petitionerRequests: 8,
    respondentRequests: 3,
    courtRequests: 1,
    sources: [
      {
        document: 'Register of Actions (Full)',
        type: 'roa'
      }
    ]
  },
  communications: {
    totalEmails: 47,
    petitionerEmails: 31,
    respondentEmails: 16,
    petitionerResponseTime: 2.3,
    respondentResponseTime: 1.8,
    sources: [
      {
        document: 'Email Thread with Realtor (Complete)',
        date: '2024-01-01 to 2024-05-31',
        type: 'email'
      }
    ]
  },
  claims: {
    invalid: [
      {
        description: 'Mortgage Payoff "Add Back"',
        amount: 77779.88,
        status: 'invalid',
        reason: 'Mathematically impossible - mortgage already deducted from sale proceeds',
        calculation: 'Petitioner\'s share of mortgage ($759,364.32 ÷ 2) = $379,682.16. Amount already paid: $301,902.28. Difference claimed: $77,779.88',
        sources: [
          { document: 'Petitioner\'s RFO', page: 8, type: 'rfo' },
          { document: 'Settlement Statement', page: 1, section: 'Line 504', type: 'settlement_stmt' }
        ]
      },
      {
        description: 'Watts Charges for November 2024',
        amount: 18112.50,
        status: 'invalid',
        reason: 'Accrued after Petitioner took exclusive possession on November 16, 2024',
        calculation: '$4,500/month × 4.025 months (Nov 16 - Mar 31, 2024)',
        sources: [
          { document: 'Court Order Re: Possession', page: 2, date: '2024-11-16', type: 'court_order' },
          { document: 'Petitioner\'s RFO', page: 12, section: 'Watts Charges', type: 'rfo' }
        ]
      },
      {
        description: 'Attorney Fees Sanctions',
        amount: 40000.00,
        status: 'invalid',
        reason: 'No evidence of bad faith conduct; Respondent exercised legal rights to defend',
        sources: [
          { document: 'Petitioner\'s RFO', page: 15, type: 'rfo' }
        ]
      },
      {
        description: 'Property Cleanup Costs',
        amount: 6419.00,
        status: 'invalid',
        reason: 'Insufficient evidence; normal wear and tear; property left in reasonable condition',
        sources: [
          { document: 'Petitioner\'s Declaration', page: 4, type: 'declaration' },
          { document: 'Photos - Exhibit C', type: 'exhibit' }
        ]
      },
      {
        description: 'Removal and Disposal Costs',
        amount: 2470.00,
        status: 'invalid',
        reason: 'No itemized receipts provided; claimed costs excessive',
        sources: [
          { document: 'Petitioner\'s Declaration', page: 5, type: 'declaration' }
        ]
      },
      {
        description: 'Storage Unit Costs',
        amount: 999.00,
        status: 'invalid',
        reason: 'Personal choice to store items; not community expense',
        sources: [
          { document: 'Petitioner\'s RFO', page: 14, type: 'rfo' }
        ]
      }
    ],
    valid: [
      {
        description: 'Watts Charges (May 2021 - November 15, 2024)',
        amount: 46200.00,
        status: 'valid',
        calculation: '$4,500/month × 10.27 months (pre-possession period)',
        sources: [
          { document: 'Petitioner\'s RFO', page: 12, type: 'rfo' },
          { document: 'Court Order Re: Possession', date: '2024-11-16', type: 'court_order' }
        ]
      },
      {
        description: 'Rental Income from Boarders (50% share)',
        amount: 5761.81,
        status: 'valid',
        calculation: 'Total rental income: $11,523.62 ÷ 2',
        sources: [
          { document: 'Petitioner\'s Income & Expense Declaration', page: 3, type: 'declaration' }
        ]
      },
      {
        description: 'Motorcycle (50% community property share)',
        amount: 5855.00,
        status: 'valid',
        calculation: 'Appraised value: $11,710 ÷ 2',
        sources: [
          { document: 'Property Settlement Agreement', page: 6, type: 'declaration' }
        ]
      },
      {
        description: 'Household Items and Furnishings',
        amount: 7500.00,
        status: 'valid',
        sources: [
          { document: 'Agreed List of Personal Property', type: 'exhibit' }
        ]
      }
    ],
    disputed: []
  },
  proposedDistribution: {
    netProceeds: 280355.83,
    petitionerShare: 172947.76,
    respondentShare: 107408.07,
    basis: 'Equal division of net proceeds ($140,177.92 each) minus valid Petitioner claims ($65,316.81) plus Respondent offset for Petitioner\'s exclusive use ($29,250) plus invalid claims adjustment ($77,779.88)',
    sources: [
      { document: 'Final Settlement Statement', page: 1, type: 'settlement_stmt' },
      { document: 'Respondent\'s Responsive Declaration', page: 8, section: 'Proposed Distribution', type: 'declaration' }
    ]
  }
});

export const EX_PARTE_TIMELINE: ExParteTimelineItem[] = [
  { date: 'Jun 14, 2024', filing: 'List property for sale', impact: 'High' },
  { date: 'Aug 9, 2024', filing: 'Sole possession', impact: 'High' },
  { date: 'Sep 12, 2024', filing: 'Declutter order', impact: 'Medium' },
  { date: 'Oct 3, 2024', filing: 'Vacate order', impact: 'High' },
  { date: 'Nov 16, 2024', filing: 'Possession enforcement', impact: 'High' },
  { date: 'Apr 22, 2025', filing: 'Elisor signature request', impact: 'Medium' },
  { date: 'May 1, 2025', filing: 'Court signature request', impact: 'Medium' }
];
