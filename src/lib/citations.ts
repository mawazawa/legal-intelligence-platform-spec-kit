// Temporarily disabled due to email-parser dependency issues

export interface EmailCitation {
  id: string;
  title: string;
  date?: string;
  detail: string;
  file?: string;
}

export interface GraphCitation {
  id: string;
  title: string;
  date?: string;
  detail: string;
  file?: string;
}

export interface CitationResult {
  emailCitations: EmailCitation[];
  graphCitations: GraphCitation[];
}

export async function buildCitations(): Promise<CitationResult> {
  // Return mock data for now
  return {
    emailCitations: [],
    graphCitations: []
  };
}