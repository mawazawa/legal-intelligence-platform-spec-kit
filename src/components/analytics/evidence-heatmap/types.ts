export interface HeatmapData {
  id: string;
  category: string;
  subcategory: string;
  strength: 'weak' | 'moderate' | 'strong' | 'airtight';
  value: number;
  evidence: string[];
  verified: boolean;
  date: string;
  source: string;
  tags: string[];
}

export interface GroupedData {
  category: string;
  subcategory: string;
  items: HeatmapData[];
  totalValue: number;
  verifiedCount: number;
  totalCount: number;
}

export type ViewMode = 'strength' | 'category' | 'timeline' | 'verified';

export type ColorScheme = 'red-blue' | 'green-red' | 'blue-yellow' | 'purple-orange';

export interface EvidenceHeatmapProps {
  evidenceData?: any[];
  onCellClick?: (data: HeatmapData) => void;
}

export interface ControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  showValues: boolean;
  onShowValuesChange: (show: boolean) => void;
  filterStrength: string;
  onFilterStrengthChange: (filter: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (filter: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onExport: () => void;
}

export interface HeatmapGridProps {
  categories: string[];
  subcategories: string[];
  groupedData: Record<string, GroupedData>;
  viewMode: ViewMode;
  showLabels: boolean;
  showValues: boolean;
  onCellClick: (data: HeatmapData) => void;
}

export interface LegendProps {
  viewMode: ViewMode;
}

export interface SelectedCellDetailsProps {
  selectedCell: HeatmapData | null;
}
