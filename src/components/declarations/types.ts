export interface EvidenceItem {
  id: string;
  type: 'document' | 'calculation' | 'timeline' | 'legal' | 'financial' | 'communication';
  title: string;
  description: string;
  source: string;
  page?: number;
  paragraph?: number;
  line?: number;
  strength: 'weak' | 'moderate' | 'strong' | 'airtight';
  category: 'petitioner' | 'respondent' | 'neutral';
  tags: string[];
  verified: boolean;
  citation: string;
  rebuttal?: string;
  counterEvidence?: string[];
}

export interface DeclarationPoint {
  id: string;
  title: string;
  petitionerClaim: string;
  respondentRebuttal: string;
  evidence: EvidenceItem[];
  legalAnalysis: string;
  strength: 'weak' | 'moderate' | 'strong' | 'airtight';
  category: 'mathematical' | 'timeline' | 'legal' | 'financial' | 'possession' | 'damages';
}
