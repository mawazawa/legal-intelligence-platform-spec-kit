export interface EvidenceNode {
  id: string;
  label: string;
  type: 'petitioner' | 'respondent' | 'neutral' | 'legal' | 'financial' | 'timeline';
  strength: 'weak' | 'moderate' | 'strong' | 'airtight';
  verified: boolean;
  category: string;
  tags: string[];
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}

export interface EvidenceEdge {
  id: string;
  source: string;
  target: string;
  type: 'supports' | 'contradicts' | 'relates' | 'rebuts';
  strength: number;
  label?: string;
}

export interface EvidenceNetworkGraphProps {
  evidenceData?: any[];
  onNodeClick?: (node: EvidenceNode) => void;
  onEdgeClick?: (edge: EvidenceEdge) => void;
}
