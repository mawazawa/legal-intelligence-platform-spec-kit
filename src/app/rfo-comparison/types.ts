export interface RFOContent {
  text: string;
  meta: Record<string, unknown>;
  pages: number;
}

export interface ComparisonPoint {
  id: string;
  title: string;
  presentedBy: 'Petitioner' | 'Attorney';
  petitionerClaim: string;
  respondentRebuttal: string;
  evidence: string[];
  feedback: string[];
  status: 'disputed' | 'conceded' | 'neutral';
  pageRefs: {
    petitioner: string;
    respondent: string;
  };
  clarifyingPrompts?: string[];
}
