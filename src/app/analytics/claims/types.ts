export interface ClaimAnalysis {
  claim: string;
  evidence: Array<{
    id: string;
    content: string;
    source: string;
    similarity: number;
    metadata: Record<string, unknown>;
  }>;
  graphContext?: {
    nodes: Array<{
      id: string;
      labels: string[];
      properties: Record<string, unknown>;
    }>;
    relationships: Array<{
      id: string;
      type: string;
      startNodeId: string;
      endNodeId: string;
      properties: Record<string, unknown>;
    }>;
  };
  answer: string;
  metadata: {
    query: string;
    totalResults: number;
    processingTime: number;
    sources: string[];
  };
}
