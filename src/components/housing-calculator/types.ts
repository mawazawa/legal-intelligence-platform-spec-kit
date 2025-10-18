import { SODAdjustments, DocumentSource, CalculationStep } from '@/types/calculations';

export interface ClosingData {
  salePrice: number;
  lenderPayoff: number;
  netProceeds: number;
  rosannaWithholding: number;
  mathieuTaxObligation: number;
  commissions: number;
  transferTaxes: number;
  countyTaxes: number;
  sellerCredits: number;
}

export interface MortgageBreakdown {
  principal: number;
  interest: number;
  escrowAdvances: number;
  lateFees: number;
  checkFees: number;
  lenderPaidExpenses: number;
  legalFees: number;
  otherFees: number;
  recordingFees: number;
  reconveyanceFee: number;
}

export interface CostAllocation {
  category: string;
  totalAmount: number;
  mathieuShare: number;
  rosannaShare: number;
  justification: string;
  legalBasis: string;
  source: string;
  icon: React.ReactNode;
  color: string;
}

export interface RealtorInfo {
  name: string;
  role: 'listing' | 'buying';
  brokerage: string;
  agentSplit: number;
  totalCommission: number;
}

export interface NegotiableParameters {
  totalCommissionRate: number;
  listingAgentSplit: number;
  buyerAgentSplit: number;
  agentBrokerSplit: number;
  wattsChargesRate: number;
  exclusivePossessionMonths: number;
}

export interface CalculationSummary {
  grossSalePrice: number;
  sellingConcessions: number;
  realEstateCommissions: number;
  escrowFees: number;
  transferTaxes: number;
  otherClosingCosts: number;
  totalLenderPayoff: number;
  netProceedsBeforeSOD: number;
  mathieuSODShare: number;
  rosannaSODShare: number;
  mathieuOwesRosanna: number;
  rosannaOwesMathieu: number;
  netAdjustment: number;
  mathieuFinalDistribution: number;
  rosannaFinalDistribution: number;
  rosannaFTBCredit: number;
}

export interface CalculationResult {
  closingData: ClosingData;
  mortgageBreakdown: MortgageBreakdown;
  sodAdjustments: SODAdjustments;
  summary: CalculationSummary;
  reasoningPath: CalculationStep[];
}

export type { SODAdjustments, DocumentSource, CalculationStep };
