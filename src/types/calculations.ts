/**
 * Shared types for financial calculations and legal document processing
 * Consolidates duplicated type definitions from multiple components
 */

/**
 * DocumentSource represents a reference to source material
 * Used consistently across all calculation steps and evidence
 */
export interface DocumentSource {
  documentName: string;
  documentDate: string;
  sectionName?: string;
  excerpt?: string;
}

/**
 * CalculationStep represents a single step in a multi-step calculation
 * Supports hierarchical sub-steps and source citations
 * Consolidated from final-distribution/page.tsx and court-filing/page.tsx
 */
export interface CalculationStep {
  stepNumber: number;
  stepName: string;
  explanation: string;
  amount: number;
  formula?: string;
  sources?: DocumentSource[];
  subSteps?: CalculationStep[];
}

/**
 * SellerDeduction represents a deduction from property sale proceeds
 * Categorized and negotiable with legal source citations
 */
export interface SellerDeduction {
  id: string;
  description: string;
  amount: number;
  category: 'commission' | 'concessions' | 'fees' | 'taxes' | 'other';
  negotiable: boolean;
  sources: DocumentSource[];
}

/**
 * BrokerageAllocation represents commission allocation to broker/agent
 * Tracks percentage and negotiability
 */
export interface BrokerageAllocation {
  id: string;
  brokerName: string;
  commissionRate: number;
  commissionAmount: number;
  negotiable: boolean;
  sources: DocumentSource[];
}

/**
 * SODAdjustments represents all adjustments from Stipulated Order of Distribution
 * Tracks amounts owed between parties from the SOD
 */
export interface SODAdjustments {
  wattsChargesOriginal: number;
  rentalIncomeShare: number;
  motorcycleShare: number;
  furnitureShare: number;
  rosannaExclusivePossession: number;
  furnitureCorrection: number;
  rosannaWithholding?: number;
  mathieuTaxObligation?: number;
}

/**
 * NegotiableParameter represents a parameter that can be adjusted
 * Used for what-if analysis and negotiation scenarios
 */
export interface NegotiableParameter {
  id: string;
  name: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  step: number;
  unit: string;
  description: string;
}

/**
 * SourceCitation represents a citation to a specific source
 * Can include line ranges for document references
 */
export interface SourceCitation {
  citations?: Array<{
    lines?: [number, number];
  }>;
}
