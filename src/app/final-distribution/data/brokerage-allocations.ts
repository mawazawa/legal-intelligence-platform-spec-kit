import { BrokerageAllocation } from '@/types/calculations';

export const brokerageAllocations: BrokerageAllocation[] = [
  {
    id: 'ron-melendez',
    brokerName: 'Ron Melendez',
    commissionRate: 3.0,
    commissionAmount: 35250,
    negotiable: true,
    sources: [
      {
        documentName: 'Final Sellers Closing Statement',
        documentDate: '05/30/2025',
        sectionName: 'Commission Split',
        excerpt: '3% to listing agent'
      }
    ]
  },
  {
    id: 'buyer-agent',
    brokerName: 'Buyer\'s Agent',
    commissionRate: 3.0,
    commissionAmount: 35250,
    negotiable: false,
    sources: [
      {
        documentName: 'Final Sellers Closing Statement',
        documentDate: '05/30/2025',
        sectionName: 'Commission Split',
        excerpt: '3% to buyer\'s agent'
      }
    ]
  }
];
