export interface SourceCitation {
  document: string;
  page?: number;
  section?: string;
  date?: string;
  type: 'court_order' | 'settlement_stmt' | 'rfo' | 'email' | 'roa' | 'declaration' | 'exhibit';
}

export interface ClaimItem {
  description: string;
  amount: number;
  status: 'valid' | 'invalid' | 'disputed';
  reason?: string;
  sources: SourceCitation[];
  calculation?: string;
}

export interface RFOAnalysisData {
  summary: {
    totalPetitionerClaims: number;
    totalInvalidClaims: number;
    totalValidClaims: number;
    netRespondentPosition: number;
    invalidPercentage: number;
    analysisDate: string;
  };
  mathematicalErrors: {
    totalInvalidClaims: number;
    percentage: number;
    coreError: string;
    detailedExplanation: string;
    sources: SourceCitation[];
  };
  propertyDetails: {
    address: string;
    salePrice: number;
    saleDate: string;
    mortgagePayoff: number;
    closingCosts: number;
    netProceeds: number;
    sources: SourceCitation[];
  };
  timeline: {
    possessionDate: string;
    daysOfUse: number;
    offsetValue: number;
    calculationMethod: string;
    sources: SourceCitation[];
  };
  exParteFilings: {
    total: number;
    frequency: string;
    impact: string;
    filings: Array<{
      date: string;
      filing: string;
      impact: 'high' | 'medium' | 'low';
      source: SourceCitation;
    }>;
  };
  continuances: {
    total: number;
    petitionerRequests: number;
    respondentRequests: number;
    courtRequests: number;
    sources: SourceCitation[];
  };
  communications: {
    totalEmails: number;
    petitionerEmails: number;
    respondentEmails: number;
    petitionerResponseTime: number;
    respondentResponseTime: number;
    sources: SourceCitation[];
  };
  claims: {
    invalid: ClaimItem[];
    valid: ClaimItem[];
    disputed: ClaimItem[];
  };
  proposedDistribution: {
    netProceeds: number;
    petitionerShare: number;
    respondentShare: number;
    basis: string;
    sources: SourceCitation[];
  };
}

export type TabId = 'overview' | 'mathematical' | 'timeline' | 'communications' | 'financial';

export interface ExParteTimelineItem {
  date: string;
  filing: string;
  impact: 'High' | 'Medium' | 'Low';
}
