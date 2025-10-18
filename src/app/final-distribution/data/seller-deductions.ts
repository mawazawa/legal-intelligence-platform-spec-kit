import { SellerDeduction } from '@/types/calculations';

export const sellerDeductions: SellerDeduction[] = [
  {
    id: 'commission',
    description: 'Real Estate Commission',
    amount: 70500,
    category: 'commission',
    negotiable: true,
    sources: [
      {
        documentName: 'Final Sellers Closing Statement',
        documentDate: '05/30/2025',
        sectionName: 'Commission',
        excerpt: '6% commission on $1,175,000'
      }
    ]
  },
  {
    id: 'concessions',
    description: 'Seller Concessions for Repairs',
    amount: 35000,
    category: 'concessions',
    negotiable: true,
    sources: [
      {
        documentName: 'Final Sellers Closing Statement',
        documentDate: '05/30/2025',
        sectionName: 'Concessions',
        excerpt: 'Repair concessions to buyer'
      }
    ]
  },
  {
    id: 'escrow-fees',
    description: 'Escrow and Title Fees',
    amount: 2500,
    category: 'fees',
    negotiable: false,
    sources: [
      {
        documentName: 'Final Sellers Closing Statement',
        documentDate: '05/30/2025',
        sectionName: 'Fees',
        excerpt: 'Escrow and title company fees'
      }
    ]
  },
  {
    id: 'tax-withholding',
    description: 'Tax Withholding (Rosanna)',
    amount: 13694.62,
    category: 'taxes',
    negotiable: false,
    sources: [
      {
        documentName: 'Final Sellers Closing Statement',
        documentDate: '05/30/2025',
        sectionName: 'Withholding',
        excerpt: 'Franchise Tax Board withholding'
      }
    ]
  }
];
