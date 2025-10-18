export interface FilingTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'review';
  priority: 'high' | 'medium' | 'low';
  category: 'document' | 'calculation' | 'evidence' | 'legal' | 'filing';
  dueDate?: string;
  completedDate?: string;
  estimatedTime?: string;
  dependencies?: string[];
  notes?: string;
  documents?: string[];
}

export interface EvidenceItem {
  id: string;
  type: 'document' | 'email' | 'roa_entry' | 'calculation' | 'timeline';
  title: string;
  description: string;
  source: string;
  relevance: number;
  status: 'verified' | 'pending' | 'disputed';
  citation: string;
  excerpt?: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  actor: 'petitioner' | 'respondent' | 'court' | 'buyer';
  impact: 'critical' | 'high' | 'medium' | 'low';
}
