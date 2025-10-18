export type QualityCategory = 'legal' | 'mathematical' | 'citation' | 'format' | 'ethics' | 'completeness';
export type QualitySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface QualityCheckItem {
  id: string;
  category: QualityCategory;
  title: string;
  description: string;
  required: boolean;
  checked: boolean;
  severity: QualitySeverity;
  evidence?: string;
  notes?: string;
}

export interface QualityControlChecklistProps {
  evidenceData?: any[];
  onChecklistComplete?: (results: QualityCheckItem[]) => void;
}

export interface ChecklistStats {
  totalItems: number;
  checkedItems: number;
  criticalItems: number;
  uncheckedCriticalItems: number;
  completionPercentage: number;
}
