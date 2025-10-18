// Shared types for opposition generation
// Single source of truth - DRY principle

export interface Evidence {
  id: string;
  content: string;
  source: string;
  similarity: number;
  metadata: Record<string, unknown>;
}

export interface CaseContext {
  caseNumber?: string;
  respondentName?: string;
  petitionerName?: string;
  courtName?: string;
}

export interface Opposition {
  paragraphs: string[];
  citations: string[];
  exhibits: Array<{
    label: string;
    description: string;
    sourceId: string;
  }>;
  legalStandards: string[];
}

export interface OppositionRequest {
  claim: string;
  evidence: Evidence[];
  caseContext?: CaseContext;
}

export interface OppositionResult {
  claim: string;
  opposition: Opposition;
  evidence: Evidence[];
  metadata: {
    processingTime: number;
    evidenceCount: number;
    model: string;
  };
}
