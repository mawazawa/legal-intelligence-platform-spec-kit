import { QualityCheckItem, QualitySeverity, ChecklistStats } from './types';

export const getSeverityColor = (severity: QualitySeverity): string => {
  const colorMap: Record<QualitySeverity, string> = {
    critical: 'text-red-700 bg-red-100 border-red-300',
    high: 'text-orange-700 bg-orange-100 border-orange-300',
    medium: 'text-yellow-700 bg-yellow-100 border-yellow-300',
    low: 'text-green-700 bg-green-100 border-green-300'
  };
  return colorMap[severity] || 'text-gray-700 bg-gray-100 border-gray-300';
};

export const calculateStats = (items: QualityCheckItem[]): ChecklistStats => {
  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const criticalItems = items.filter(item => item.severity === 'critical');
  const uncheckedCriticalItems = criticalItems.filter(item => !item.checked).length;
  const completionPercentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return {
    totalItems,
    checkedItems,
    criticalItems: criticalItems.length,
    uncheckedCriticalItems,
    completionPercentage
  };
};

export const filterItems = (
  items: QualityCheckItem[],
  activeCategory: string,
  searchTerm: string,
  showOnlyCritical: boolean
): QualityCheckItem[] => {
  return items.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !showOnlyCritical || item.severity === 'critical';
    return matchesCategory && matchesSearch && matchesSeverity;
  });
};

export const exportChecklistToJSON = (
  items: QualityCheckItem[],
  stats: ChecklistStats
): void => {
  const data = {
    ...stats,
    items
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quality-control-checklist.json';
  link.click();
  URL.revokeObjectURL(url);
};
