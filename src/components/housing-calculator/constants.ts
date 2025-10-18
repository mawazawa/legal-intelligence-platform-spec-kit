import { ClosingData, MortgageBreakdown, RealtorInfo } from './types';
import { SODAdjustments } from '@/types/calculations';

export const DEFAULT_CLOSING_DATA: ClosingData = {
  salePrice: 1175000.00,
  lenderPayoff: 759364.32,
  netProceeds: 280355.83,
  rosannaWithholding: 13694.62,
  mathieuTaxObligation: 25000,
  commissions: 58750.00,
  transferTaxes: 6580.00,
  countyTaxes: 1107.75,
  sellerCredits: 26991.01,
};

export const DEFAULT_MORTGAGE_BREAKDOWN: MortgageBreakdown = {
  principal: 681774.56,
  interest: 32332.29,
  escrowAdvances: 38924.96,
  lateFees: 307.80,
  checkFees: 50.00,
  lenderPaidExpenses: 4747.95,
  legalFees: 946.76,
  otherFees: 85.00,
  recordingFees: 190.00,
  reconveyanceFee: 25.00,
};

export const DEFAULT_SOD_ADJUSTMENTS: SODAdjustments = {
  wattsChargesOriginal: 48640.00,
  rentalIncomeShare: 5761.81,
  motorcycleShare: 5855.00,
  furnitureShare: 7500.00,
  rosannaExclusivePossession: 33500.00,
  furnitureCorrection: 15000.00,
  rosannaWithholding: 13694.62,
  mathieuTaxObligation: 25000.00,
};

export const DEFAULT_REALTOR_INFO: RealtorInfo[] = [
  {
    name: "Stephanie Younger",
    role: "listing",
    brokerage: "Compass - Stephanie Younger Group",
    agentSplit: 0.7,
    totalCommission: 29375.00
  },
  {
    name: "Compass Beverly Hills Agent",
    role: "buying",
    brokerage: "Compass Beverly Hills",
    agentSplit: 0.7,
    totalCommission: 29375.00
  }
];

export const PRINT_STYLES = `
  @media print {
    .no-print {
      display: none !important;
    }
    body {
      background: white !important;
    }
    .bg-gradient-to-br {
      background: white !important;
    }
    .shadow-lg, .shadow-xl, .shadow-2xl {
      box-shadow: none !important;
    }
    .animate-in {
      animation: none !important;
    }
    .hover\\:scale-105:hover {
      transform: none !important;
    }
  }
`;
